import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

interface MaterialGroup {
  name: string;
  item_type_details?: any;
  children?: MaterialGroup[];
  allItem:boolean;
  material_master?:any
}

var TREE_DATA: MaterialGroup[] = []

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  item_type_details: any;
  total_group: number;
  item_in_group: number;
  item_in_subgroup: number;
  total_item: number;
  level: number;
  allItem:boolean;
  material_master:any;
}

@Component({
  selector: 'app-material-group-tree',
  templateUrl: './material-group-tree.component.html',
  styleUrls: ['./material-group-tree.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
  ]
})

export class MaterialGroupTreeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'item_type', 'total_group', 'item_in_group', 'item_in_subgroup', 'total_item'];
  localStorageData: any;
  selectItemGroup:any;
  normalTableData:any
  allItemGroup:any=[]
  addUser: any = {
    itemgroup: '',
    itemtype: '',
  }
  materialList:any;

  transformer = (node: MaterialGroup, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      item_type_details: node.item_type_details,
      total_group: this.fullNodeCount(node),
      item_in_group:this.itemInGroupCount(node),
      item_in_subgroup: this.iteminSubCount(node),
      total_item: Number(this.itemInGroupCount(node))+ Number(this.iteminSubCount(node)),
      level: level,
      allItem:node?.allItem
    };
  }

  treeControl: any = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level,
    node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
  ) {}

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getData();
    this.viewMaterialList();
  }

  getData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      TREE_DATA = this.list_to_tree(data.results);
      this.selectItemGroup=data.results;
      this.setDeafLevel();
     this.dataSource.data = this.allDescendants(TREE_DATA);
    })
  }

  viewMaterialList() {
    let params = new URLSearchParams();
    params.set('all', 'true');
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.materialList = data.results;
    })
  }

  setDeafLevel(fullobj?: any, parent?: string) {
    const children = this.selectItemGroup.filter((c:any) => c.parent == parent);
    if (children.length > 0) {
      children.map((c:any, index:any) => {
        const object: any = Object.assign({}, c, {
          deafLevel: fullobj ? fullobj.deafLevel + 1 : 0,
          index: (fullobj ? fullobj.index : 0) + index * Math.pow(0.1, c.deafLevel)
        })
        this.allItemGroup.push(object);
        this.setDeafLevel(object, object.id);
      });
    }
    return parent;
  }




  findNode(Data:any,Name:any){
    let array:any=[]
   for(let val of Data){
     if(this.searchTree(val,Name)){
       array.push(this.searchTree(val,Name));
     }
   }
   return array
 }

  searchTree(element:any, matchingTitle:any) {
    if (element.name == matchingTitle) {
      return element;
    } else if (element.children != null) {
      var i;
      var result:any = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = this.searchTree(element.children[i], matchingTitle);
      }
      return result;
    }
    return null;
  }


  onSearch(){
    if(this.addUser.itemgroup){
      this.dataSource.data=this.findNode(TREE_DATA, this.addUser.itemgroup);
    }
  }

  // mergeItemnGroup(Data:any) {
  //   for(let i=0;i<Data.length;i++) {
  //     for(let k=0;k<Data[i].material_master.length;k++) {
  //       Data[i].material_master[k]["name"] = Data[i].material_master[k].material_name
  //       Data[i].material_master[k]["children"] = []
  //       Data[i].material_master[k]["allItem"] = true;
  //     }
  //     Data[i].children = Data[i].material_master.concat(Data[i].children)

  //     for(let k=0;k<Data[i].children.length;k++) {
  //       Data[i].children[k] = this.mergeItemnGroup(Data[i].children[k])
  //     }
  //   }
  //   return Data
  // }

  allDescendants (node:any) {

    for(let j=0;j<node.length;j++){
      for (var i = 0; i < node[j].children.length; i++) {

        var child = node[j].children[i];

        for(let val of child.material_master){
          val["name"] = val.material_name
          val["children"] = []
          val["allItem"] = true;
        }

        child.children = child.material_master.concat(child.children)
        this.allDescendants(child);
      }
    }

  return node   
}

  list_to_tree(treeStructure: any) {
    const comments = treeStructure
    const nest: any = (items: any[], id = null, link = 'parent') =>
    {
      items
        .filter((item: { [x: string]: null; }) => item[link] === id)
        .map((item: { id: null | undefined; }) => ({ ...item, children: nest(items, item.id) }));
    }

    return nest(comments)

  }
 
  fullNodeCount(items: any) {
    let count = 0
    items?.children?.map((item: any) => {
      if (item.children && item.allItem!=true) {
        count++;
        item.children.map((subItem: any) => {
          if (subItem.children && subItem.allItem!=true) {
            count++;
            subItem.children.map((subSubItem: any) => {
              if (subSubItem.children && subSubItem.allItem!=true) {
                count++;
              }
            })
          }
        })
      }
    });

    return count;
  }

  itemInGroupCount(items: any) {
    let count = 0
    items?.children?.map((item: any) => {
      if (item.children && item.allItem==true) {
        count++;
        item.children.map((subItem: any) => {
          if (subItem.children && subItem.allItem==true) {
            count++;
            subItem.children.map((subSubItem: any) => {
              if (subSubItem.children && subSubItem.allItem==true) {
                count++;
              }
            })
          }
        })
      }
    });

    return count;
  }

  iteminSubCount(items: any) {
    let count = 0
    items?.children?.map((item: any) => {
      if (item.parent && item.material_master.length) {
        count=count+item.material_master.length;
        item.children.map((subItem: any) => {
          if (subItem.parent && subItem.material_master.length) {
            count=count+item.material_master.length;
            subItem.children.map((subSubItem: any) => {
              if (subSubItem.parent && subSubItem.material_master.length) {
                count=count+item.material_master.length;
              }
            })
          }
        })
      }
    });

    return count;
  }

  setMyStyles( data:any) {
    let styles = {
      'margin-left': data*20 + 'px',
    };
    return styles;
  }

}
