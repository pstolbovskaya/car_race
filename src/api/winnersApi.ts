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

export const updateWinner = async (id: number, wins: number, time: number) => {
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


export const getWinner = async (id: number) => {
    const params = new URLSearchParams();
    params.append("id", id.toString());

    const response = await fetch(`http://localhost:3000/winners/${params}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
    return response.json();
}

export const getWinners = async (page: number, limit: number, sort: 'id' | 'wins' | 'time', order: 'ASC' | 'DESC') => {
    const params = new URLSearchParams();
    params.append("_page", page.toString());
    params.append("_limit", limit.toString());
    params.append("_sort", sort.toString());
    params.append("_order", order.toString());
    return await fetch(`http://localhost:3000/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}

export const deleteWinner = async (id: number) => {
    const params = new URLSearchParams();
    params.append("id", id.toString());
    return await fetch(`http://localhost:3000//winners/${params}`, {
        method: 'DELETE',
    })
}
