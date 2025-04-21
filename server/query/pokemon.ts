import axios, { AxiosResponse } from 'axios';

import { Pokemon } from '@/models/pokemon/Pokemon.models';

export async function getRandomPokemon(queryKey): Promise<AxiosResponse<Pokemon>> {
  // create random ID between 1 and 151
  const randomId = Math.floor(Math.random() * 151) + 1;
  const response = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  return response;
}

export async function getPokemonById(id: number): Promise<AxiosResponse<Pokemon>> {
  const response = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return response;
}

export async function getRandomPokemonData(): Promise<Pokemon> {
  // create random ID between 1 and 151
  const randomId = Math.floor(Math.random() * 151) + 1;
  const response: AxiosResponse<Pokemon> = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  return response.data;
}
