import { makeQueryClient } from "./queryClient";
import { cache } from "react";

export const getQueryClient = cache(() => makeQueryClient());
