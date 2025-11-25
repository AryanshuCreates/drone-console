import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonCreated<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function jsonBadRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function jsonNotFound(message = "Resource not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function jsonServerError(message = "Unexpected server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}
