import { type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PrefRoute, PrefRouteDetails } from "../types/common";
import { PrefRouteContext } from "../hooks/usePrefRoutes";

export function PrefRoutesProvider({ children }: { children: ReactNode }){
    
    const { data, error, isLoading } = useQuery<PrefRoute[]>({ queryKey: ['todos'], queryFn: async () => {
        //https://www.aviationapi.com/
        const response = await(fetch("https://nxu5mmeinzsudmodet6oxkkjfq0yquip.lambda-url.us-east-2.on.aws/"));
        return await response.json();
    }});
    
    if (isLoading || !data) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;
    console.log(data)
    const value: PrefRouteDetails = {
        tecRoutes: data.filter(route => route.type === "TEC"),
        highRoutes: data.filter(route => route.type === "H")
    }

    return <PrefRouteContext.Provider value={value}>{children}</PrefRouteContext.Provider>
}
