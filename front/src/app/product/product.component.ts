import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../product';
import { ProductService } from '../product.service';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  depName: string = '';
  products: Product[] = [];
  depEdit: Product = null;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(private productSevice: ProductService,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.productSevice.get()
    .pipe(takeUntil (this.unsubscribe$))
    .subscribe ((deps)=>this.products = deps)
  }

  save(){
    if(this.depEdit){
      this.productSevice.update(
        {name:this.depName, _id: this.depEdit._id}
      ).subscribe(
        (dep)=>{
          this.notify('UPDATED!')
        },
        (err)=>{
          this.notify('ERROR');
          console.error(err);
        }
      )
    }
    else{
      this.productSevice.add({name:this.depName})
      .subscribe(
        (dep)=>{
          console.log(dep);
          this.notify('UPDATED!');
        },
        (err)=>{
          console.error(err);
        }
      )
    }
    this.clearFields();
  }

  edit(dep:Product){
    this.depName=dep.name;
    this.depEdit = dep;
  }


delete(dep: Product){
  this.productSevice.del(dep)
  .subscribe(
    () => this.notify('REMOVED!'),
    (err) => this.notify(err.error.msg)
  )
}


clearFields(){
  this.depName = '';
  this.depEdit = null;
}

cancel(){
  this.clearFields();
}

notify(msg: string){
  this.snackbar.open(msg, 'OK', { duration:3000});
}

ngOnDestoy(){
  this,this.unsubscribe$.next();
}



}
