import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BackendSolutionResponse {
  id: string;
  problemDescription: string;
  improve?: string;
  worsen?: string;
  triz: { response: string; principles?: { id: number; name: string; description: string }[] }[];
  scamper: { response: string }[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = `${(window as any).__env?.backendUrl || 'http://localhost:3000'}/api`;

  solve(payload: { problemDescription: string; improve?: string; worsen?: string }): Observable<BackendSolutionResponse> {
    return this.http.post<BackendSolutionResponse>(`${this.baseUrl}/solve`, payload);
  }

  rateSolution(id: string, rating: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/${id}/rate`, { rating });
  }
}
