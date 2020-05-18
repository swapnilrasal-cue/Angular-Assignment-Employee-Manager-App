import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {

  transform(value: any, filterStatus: string): any {
    if(value.length <= 0 || filterStatus == ''){
      return value;
    }
    let resultArray = [];
    for(let item of value){
      if(item['disabled'].toLowerCase() === filterStatus.toLowerCase()){
        resultArray.push(item);
      }
    }
    return resultArray;
  }

}
