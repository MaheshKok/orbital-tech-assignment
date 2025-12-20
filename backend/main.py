"""
Main entry point for the Orbital Witness Usage API.

Run with: uvicorn main:app --reload
"""
import uvicorn

from app.create_app import get_app
from app.utils.constants import ConfigFile

app = get_app(ConfigFile.DEVELOPMENT)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
