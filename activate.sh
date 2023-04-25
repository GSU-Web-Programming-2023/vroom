#!/bin/bash

# create virtual environment
python -m venv venv

# activate virtual environment
if [[ "$OSTYPE" == "win32" ]]; then
    venv/Scripts/activate
else
    source venv/bin/activate
fi
