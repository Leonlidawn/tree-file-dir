//TODO:we can have a json objectore stored in a file/database
//shares files across components
import { Injectable } from "@angular/core";
import { BehaviorSubject, Timestamp } from "rxjs";
import { NodeModel } from "../models/node.model";


@Injectable({ providedIn: 'root' })
export class FilesService {

  //structure for search
  public nodeRecords: Record<string,NodeModel> ={};
  public parentRecords: Record<string,string> ={};

  public rootNodes: NodeModel[] = [];
  public filesUpdatedAt$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(){}

  type: 'folder' | 'file' | 'unset' | null;
  name?: string;
  children?: NodeModel[];
  id: string;
  public createAndInsertNode(parentId:string ,type:'folder' | 'file' | 'unset' | null, name?:string, children?:NodeModel[] ){
    if(name == '' || name == undefined){
      return;
    }
    console.log(name)
    const newNode = new NodeModel();
    //TODO: use uuid to generate id
    newNode.id = (performance.now()+Math.random().toFixed(10)).replace(/\./g,'');

    newNode.name = name;
    newNode.type = type;
    newNode.children = children;

    this.insertNode(newNode, parentId);
  }


  /**
   * @description  if anchorNodeId not specified, add to root, otherwise as child of given folder
   * @param newNode a newNode will not have an id. its id will be generated.
   * @param folderId
   */
  public insertNode(node:NodeModel, folderId?:string){
    //empty name, cancel insert
    if(node.name == ''){
      return;
    }

    //node is already in file tree
    if(this.nodeRecords[node.id]){
      console.error('node is already in file tree');
      return;
    }

    //add to root
    if(folderId == undefined || folderId == ''){
      this.rootNodes.push(node);
    }else{//add to folder
      const anchorNode = this.nodeRecords[folderId];

      if(!anchorNode){
        console.error('folder not found');
        return;
      }

      //error: type is not folder
      if(anchorNode.type !== 'folder'){
        console.error(`node ${anchorNode.id} is not a folder`)
        return;
      }
      
      anchorNode.children 
        ? anchorNode.children.push(node)
        : anchorNode.children = [node];
      this.parentRecords[node.id] = folderId;
    }

    this.nodeRecords[node.id] = node;
    this.filesUpdatedAt$.next(Date.now());
  }

  public deleteNode(nodeId:string){
    //files does not exist
    if(!this.nodeRecords[nodeId]){
      return;
    }

    //remove from records
    delete(this.nodeRecords[nodeId]);

    //if has parent
    if(this.parentRecords[nodeId]){
      //remove from parent
      this.nodeRecords[this.parentRecords[nodeId]].children.filter(
        (node)=>node.id !== nodeId
      )
      //remove parent record
      delete(this.parentRecords[nodeId])
    }else{//remove from rootNodes
      this.rootNodes.filter(
        (node)=>{
          node.id !== nodeId;
        }
      )
    }
    this.filesUpdatedAt$.next(Date.now());
  }

}