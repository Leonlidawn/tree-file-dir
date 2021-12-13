import { style } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { NodeModel } from 'src/app/models/node.model';
import { FilesService } from 'src/app/services/files.service';
import { safeObserve } from 'src/app/utils/rxjs.utils';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls:["./home.page.scss"]
})

export class HomePage implements OnInit {
  @ViewChild('autoFocusInput', { static: false }) input: ElementRef;
  public files:NodeModel[] = [];
  public filesJson:string;

  public folderIdOnInsert:string;
  public isAddingFolderToRoot:boolean;

  public newFileName:string;

  private unsubscribeAll: Subject<void> = new Subject();

  constructor(private router: Router,
    public fileService:FilesService
    ) {
  }

  ngOnInit() {
    safeObserve(this.fileService.filesUpdatedAt$, this.unsubscribeAll).subscribe(() => {
      this.files = this.fileService.rootNodes;
      this.filesJson = JSON.stringify(this.files);
    });
  }

  public createNode(parentId?:string){
    this.fileService.createAndInsertNode(parentId,'folder','folder');
  }

  public addingFolderToRoot(){
    this.isAddingFolderToRoot = true;
    setTimeout(
      ()=>{
        this.input.nativeElement.focus();
      }
    )
  }

  public cancelAddingFolderToRoot(){
    this.isAddingFolderToRoot = false;
    this.newFileName = '';
  }

  public createNodeToRoot(){
    this.fileService.createAndInsertNode('','folder',this.newFileName);
    this.newFileName = '';
    this.isAddingFolderToRoot = false;
  }

  public handleInputKeyUp(event){
    if(event.keyCode === 13){
      this.createNodeToRoot();
    }
  }


}
