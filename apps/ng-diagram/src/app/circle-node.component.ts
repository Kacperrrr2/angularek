import { Component, input } from '@angular/core';
import { NgDiagramNodeTemplate, SimpleNode } from 'ng-diagram';

@Component({
  selector: 'app-circle-node',
  standalone: true,
  template: `
    <div class="circle-node">
      <div class="content">{{ node().data?.['label'] }}</div>
    </div>
  `,
  styles: [`
    .circle-node {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: hsl(0, 0%, 100%);
      border: 1.5px solid hsl(240, 5.9%, 90%);
      color: hsl(240, 10%, 3.9%);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 13px;
      font-weight: 500;
      box-sizing: border-box;
      padding: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease-in-out;
      cursor: pointer;
    }
    
    /* Hover state */
    .circle-node:hover {
      border-color: hsl(240, 5.9%, 80%);
      background: hsl(240, 4.8%, 98%);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      transform: translateY(-2px);
    }
    
    /* Selected state */
    :host-context(.ng-diagram-node-selected) .circle-node {
      border-color: hsl(240, 10%, 3.9%);
      background: hsl(240, 4.8%, 95.9%);
      box-shadow: 0 0 0 1px hsl(0, 0%, 100%), 0 0 0 3px hsl(240, 10%, 3.9%);
    }
    
    .content {
      line-height: 1.3;
      word-wrap: break-word;
    }
  `]
})
export class CircleNodeComponent implements NgDiagramNodeTemplate<any> {
  node = input.required<SimpleNode<any>>();
}
