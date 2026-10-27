
from pathlib import Path
import json

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Raízes Sul-Americanas")

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)

templates = Jinja2Templates(directory=BASE_DIR / "templates")


def load_countries():
    file_path = BASE_DIR / "data" / "countries.json"
    with file_path.open("r", encoding="utf-8") as file:
        return json.load(file)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )


@app.get("/api/countries")
async def get_countries():
    return load_countries()


@app.get("/api/countries/{country_id}")
async def get_country(country_id: str):
    countries = load_countries()

    for country in countries:
        if country["id"] == country_id:
            return country

    raise HTTPException(status_code=404, detail="País não encontrado")
