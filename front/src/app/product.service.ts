import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Product } from './product'
import { tap, delay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly url = 'http://localhost:3000/products';

  private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
  private loaded: boolean = false;
  constructor(private http: HttpClient) { }

  get(): Observable<Product[]> {
    if (!this.loaded) {
      this.http.get<Product[]>(this.url)
      .pipe(
        tap((deps) => console.log(deps)),
        delay(1000)
      )
        .subscribe(this.productsSubject$);
      this.loaded = true;
    }
    return this.productsSubject$.asObservable();
  }

  add(d: Product): Observable<Product> {
    return this.http.post<Product>(this.url, d)
      .pipe(
        tap((dep: Product) => this.productsSubject$.getValue().push(dep))
      )
  }
  del(dep: Product): Observable<any> {
    return this.http.delete(`${this.url}/${dep._id}`)
      .pipe(
        tap(() => {
          let products = this.productsSubject$.getValue();
          let i = products.findIndex(d => d._id === dep._id);
          if (i >= 0){
            products.splice(i, 1);
          }
        })
      )
  }

  update(dep: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${dep._id}`, dep)
      .pipe(
        tap((d) => {
          let product = this.productsSubject$.getValue();
          let i = product.findIndex(d => d._id === dep._id);
          if (i >= 0){
            product[i].name = d.name;
          }
        })
      )
  }
}
