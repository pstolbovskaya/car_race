import {ENGINE_FAILED} from "./engineApi.ts";
import {ServerListener} from "../serverDetails/serverListener.ts";

export const createWinner = async (id: number, wins: number, time: string) =>
    await fetch('http://localhost:3000/winners/', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            id: id, wins: wins, time: time,
        }),
    });

export const updateWinner = async (id: number, wins: number, time: string) => {
    const params = new URLSearchParams();
    params.append("id", id.toString());
    return await fetch(`http://localhost:3000/winners/${id}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            wins: wins, time: time,
        }),
    })
}

export const getWinner = async (id: number): Promise<WinnerType> => {
    const params = new URLSearchParams();
    params.append("id", `${id}`);

    const response = await fetch(`http://localhost:3000/winners/${id}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });

    if (response.status !== 200) {
        throw new Error(response.statusText);
    }
    if (response.status !== 200) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

export type WinnerType = {
    id: number,
    wins: number,
    time: number,
}

export const getWinners = async (page: number, limit: number, sort: 'id' | 'wins' | 'time', order: 'ASC' | 'DESC') => {
    const params = new URLSearchParams();

    params.append("_page", page.toString());
    params.append("_limit", limit.toString());
    params.append("_sort", sort.toString());
    params.append("_order", order.toString());
    const result = await fetch(`http://localhost:3000/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
    console.log(sort, order)
    if (result.status !== 200) {
        throw new Error(result.statusText);
    }
    const winners = await result.json();

    ServerListener.winners.winPage.winners = winners;
    ServerListener.winners.winPage.page = page;
    ServerListener.winners.winPage.limit = limit;
    ServerListener.winners.notify();

    return winners;
}

export const deleteWinner = async (id: number) => {
    const params = new URLSearchParams();
    params.append("id", id.toString());
    return await fetch(`http://localhost:3000/winners/${id}`, {
        method: 'DELETE',
    })
}
