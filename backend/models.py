
from pydantic import BaseModel, Field, field_validator


class TodoCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Task title cannot be empty")

        return value


class TodoUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    completed: bool

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Task title cannot be empty")

        return value

