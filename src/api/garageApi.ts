import {CarType} from "../serverDetails/garageServer.ts";

export let carsAmount: string | null = null;

export const createCar = async (name: string, color: string) =>
    await fetch('http://localhost:3000/garage', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            name: name.toLowerCase(), color: color.toLowerCase(),
        }),
    });

export const updateCar = async (id: number, name: string, color: string) =>
    await fetch(`http://localhost:3000/garage/${id}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            name: name.toLowerCase(), color: color.toLowerCase(),
        }),
    });

export const getCar = async (id: number): Promise<CarType> => {
    const response = await fetch(`http://localhost:3000/garage/${id}`, {
        method: 'GET',
    });

    if (response.status !== 200) {
        throw new Error(response.statusText);
    }

    return response.json();
}

export const getCars = async (page: number, limit: number): Promise<Array<CarType>> => {
    const params = new URLSearchParams();

    params.append("_page", page.toString());
    params.append("_limit", limit.toString());

    const response = await fetch(`http://localhost:3000/garage?${params}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });

    if (response.status !== 200) {
        throw new Error(response.statusText);
    }

    carsAmount = response.headers.get("X-Total-Count");

    return response.json();
}

export const deleteCar = async (id: number) =>
    await fetch(`http://localhost:3000/garage/${id}`, {
        method: 'DELETE',
    })