from pathlib import Path
import json

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

DATA_FILE = Path("data/data.json")


def load_data():
	"""Load application data from the JSON file."""
	if not DATA_FILE.exists():
		return {}

	return json.loads(DATA_FILE.read_text())


def save_data(data):
	"""Save application data to the JSON file."""
	DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
	DATA_FILE.write_text(json.dumps(data, indent=2))


@app.get("/")
def index():
	"""Render the application."""
	return render_template("index.html")


@app.get("/api/data")
def get_data():
	"""Return application data as JSON."""
	return jsonify(load_data())


@app.post("/api/data")
def update_data():
	"""Save JSON data sent by the client."""
	save_data(request.get_json())
	return jsonify({"success": True})


if __name__ == "__main__":
	app.run(debug=True)