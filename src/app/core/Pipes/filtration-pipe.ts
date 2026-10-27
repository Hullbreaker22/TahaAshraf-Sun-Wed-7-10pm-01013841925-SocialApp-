import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtration',
})
export class FiltrationPipe implements PipeTransform {
  transform(arr: any[], searchTerm:string): any {
    return arr.filter((items)=>items.user.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()));
  }
}
