interface RequestContext {
    request: Request;
    env: Record<string, unknown>;
    params: Record<string, string>;
}

export async function onRequest(context: RequestContext): Promise<Response> {
    return new Response("hello")
}