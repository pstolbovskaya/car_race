import {CarType} from "../serverDetails/garageServer.ts";

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

export const updateCar = async (id: number, name: string, color: string) => {
    const params = new URLSearchParams();

    params.append("id", id.toString());

    return await fetch(`http://localhost:3000/garage/${params}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            name: name.toLowerCase(), color: color.toLowerCase(),
        }),
    });
}
export const getCar = async (id: number): Promise<CarType> => {
    const params = new URLSearchParams();

    params.append("id", id.toString());
    const response = await fetch(`http://localhost:3000/garage/${id}`, {
        method: 'GET',
    });
    return response.json();
}

export const getCars = async (page: number, limit: number) => {
    const params = new URLSearchParams();

    params.append("_page", page.toString());
    params.append("_limit", limit.toString());

    return await fetch(`http://localhost:3000/garage?_page=${params}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}

export const deleteCar = async (id: number) => {
    const params = new URLSearchParams();

    params.append("id", id.toString());
    return await fetch(`http://localhost:3000/garage/${params}`, {
        method: 'DELETE',
    })
}
