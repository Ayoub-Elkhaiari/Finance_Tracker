import datetime as dt
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models import Category, Transaction, User
from app.schemas.transaction import TransactionCreate, TransactionResponse, TransactionUpdate

router = APIRouter(prefix="/transactions", tags=["transactions"])


def _ensure_category(
    db: Session,
    user_id: int,
    category_id: int,
    transaction_type: Literal["income", "expense"],
) -> None:
    category = db.scalar(select(Category).where(Category.id == category_id, Category.user_id == user_id))
    if category is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category")
    if category.type != transaction_type:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category type mismatch")


@router.get("", response_model=list[TransactionResponse])
def list_transactions(
    start_date: dt.date | None = Query(default=None),
    end_date: dt.date | None = Query(default=None),
    category_id: int | None = Query(default=None),
    type: Literal["income", "expense"] | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Transaction]:
    conditions = [Transaction.user_id == current_user.id]

    if start_date:
        conditions.append(Transaction.date >= start_date)
    if end_date:
        conditions.append(Transaction.date <= end_date)
    if category_id:
        conditions.append(Transaction.category_id == category_id)
    if type:
        conditions.append(Transaction.type == type)

    query = select(Transaction).where(and_(*conditions)).order_by(Transaction.date.desc(), Transaction.id.desc())
    return list(db.scalars(query))


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    payload: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Transaction:
    _ensure_category(db, current_user.id, payload.category_id, payload.entry_type)

    transaction = Transaction(
        user_id=current_user.id,
        amount=payload.amount,
        category_id=payload.category_id,
        type=payload.entry_type,
        date=payload.entry_date,
        description=payload.description,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    payload: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Transaction:
    transaction = db.scalar(
        select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == current_user.id)
    )
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    updates = payload.model_dump(exclude_unset=True, by_alias=False)
    next_type = updates.get("entry_type", transaction.type)
    next_category_id = updates.get("category_id", transaction.category_id)
    _ensure_category(db, current_user.id, next_category_id, next_type)

    for key, value in updates.items():
        mapped_key = "type" if key == "entry_type" else "date" if key == "entry_date" else key
        setattr(transaction, mapped_key, value)

    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    transaction = db.scalar(
        select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == current_user.id)
    )
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
