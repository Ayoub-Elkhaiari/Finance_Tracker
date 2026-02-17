from pydantic import BaseModel, Field


class BudgetBase(BaseModel):
    category_id: int
    amount: float = Field(gt=0)
    month: str = Field(pattern=r"^\d{4}-\d{2}$")


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    category_id: int | None = None
    amount: float | None = Field(default=None, gt=0)
    month: str | None = Field(default=None, pattern=r"^\d{4}-\d{2}$")


class BudgetResponse(BudgetBase):
    id: int

    model_config = {"from_attributes": True}
