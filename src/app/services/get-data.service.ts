import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetDataService {

  jsonData: any;
  dataArray = [];

  constructor(private http: HttpClient) {}

  async getArray() {
    const data = await this.getJsonData().toPromise();
    await this.treatData(data);
    return this.dataArray;
  }

  //Pega o arquivo JSON no caminho /assets/data/dados_1.json
  getJsonData() {
    return this.http.get('/assets/data/dados_1.json').pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  //Trata os dados recolhidos do arquivo de JSON, transformando eles em uma array de objetos
  treatData(data: any) {
    this.dataArray = Object.values(data);
    console.log(this.dataArray);
  }
}
