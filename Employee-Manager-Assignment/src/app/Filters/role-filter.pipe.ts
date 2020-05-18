import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleFilter'
})
export class RoleFilterPipe implements PipeTransform {

  transform(value: any, filterRole: string): any {
    if(value.length <= 0 || filterRole == ''){
      return value;
    }
    let resultArray = [];
    for(let item of value){
      if(item['role'].toLowerCase() === filterRole.toLowerCase()){
        resultArray.push(item);
      }
    }
    return resultArray;
  }

}
