from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models import Budget, Category, Transaction, User
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
def list_categories(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[Category]:
    return list(db.scalars(select(Category).where(Category.user_id == current_user.id).order_by(Category.id)))


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Category:
    category = Category(user_id=current_user.id, name=payload.name, type=payload.type)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Category:
    category = db.scalar(
        select(Category).where(Category.id == category_id, Category.user_id == current_user.id)
    )
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    category = db.scalar(
        select(Category).where(Category.id == category_id, Category.user_id == current_user.id)
    )
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    in_use = db.scalar(select(Transaction.id).where(Transaction.category_id == category_id).limit(1))
    budgeted = db.scalar(select(Budget.id).where(Budget.category_id == category_id).limit(1))
    if in_use or budgeted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category is in use by transactions or budgets",
        )

    db.delete(category)
    db.commit()
