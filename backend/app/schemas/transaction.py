import datetime as dt
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

TransactionKind = Literal["income", "expense"]


class TransactionBase(BaseModel):
    amount: float = Field(gt=0)
    category_id: int
    entry_type: TransactionKind = Field(alias="type")
    entry_date: dt.date = Field(alias="date")
    description: str | None = Field(default=None, max_length=255)

    model_config = ConfigDict(populate_by_name=True)


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    amount: float | None = Field(default=None, gt=0)
    category_id: int | None = None
    entry_type: TransactionKind | None = Field(default=None, alias="type")
    entry_date: dt.date | None = Field(default=None, alias="date")
    description: str | None = Field(default=None, max_length=255)

    model_config = ConfigDict(populate_by_name=True)


class TransactionResponse(TransactionBase):
    id: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
