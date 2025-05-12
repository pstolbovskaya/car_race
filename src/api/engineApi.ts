export  const ENGINE_FAILED = "Engine failed";
export const switchEngine = async (id: number, status: "started" | "stopped") => {
    const params = new URLSearchParams();

    params.append("id", id.toString());
    params.append("status", status.toString());

    const response = await fetch(`http://localhost:3000/engine?${params}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    })
    return response.json();
}
export const drive = async (idParam: number)  => {

    const params = new URLSearchParams();
    params.append("id", idParam.toString());
    params.append("status", "drive");

    const response = await fetch(`http://localhost:3000/engine?${params}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });

    if (response.status === 500) {
        throw new Error(ENGINE_FAILED);
    }

    return response.json();
}
