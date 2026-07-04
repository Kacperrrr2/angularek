import { Component } from '@angular/core';
import { NgDiagramComponent, initializeModel, NgDiagramNodeTemplateMap, provideNgDiagram } from 'ng-diagram';
import { CircleNodeComponent } from './circle-node.component';

@Component({
  selector: 'app-root',
  imports: [NgDiagramComponent],
  providers: [provideNgDiagram()],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'ng-diagram';
  
  protected nodeTemplates = new NgDiagramNodeTemplateMap([
    ['circle', CircleNodeComponent]
  ]);
  
  protected model = initializeModel({
    nodes: [
      { id: 'problem', position: { x: 50, y: 350 }, size: { width: 100, height: 100 }, type: 'circle', data: { label: 'Problem' } },
      { id: 'triz', position: { x: 200, y: 350 }, size: { width: 100, height: 100 }, type: 'circle', data: { label: 'Macierz TRIZ' } },
      { id: 'cand-1a', position: { x: 400, y: 50 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Kandydat rozwiązania' } },
      { id: 'cand-1b', position: { x: 600, y: 50 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Oceniony Kandydat' } },
      { id: 'cand-2a', position: { x: 400, y: 200 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Kandydat rozwiązania' } },
      { id: 'cand-2b', position: { x: 600, y: 200 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Oceniony Kandydat' } },
      { id: 'cand-3a', position: { x: 400, y: 350 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Kandydat rozwiązania' } },
      { id: 'cand-3b', position: { x: 600, y: 350 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Oceniony Kandydat' } },
      { id: 'cand-4a', position: { x: 400, y: 500 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Kandydat rozwiązania' } },
      { id: 'cand-4b', position: { x: 600, y: 500 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Oceniony Kandydat' } },
      { id: 'cand-5a', position: { x: 400, y: 650 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Kandydat rozwiązania' } },
      { id: 'cand-5b', position: { x: 600, y: 650 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Oceniony Kandydat' } },
      { id: 'choose', position: { x: 850, y: 350 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Wybierz najlepsze' } },
      { id: 'best', position: { x: 1100, y: 350 }, size: { width: 120, height: 120 }, type: 'circle', data: { label: 'Kandydat najlepszy' } }
    ],
    edges: [
      { id: 'e1', source: 'problem', target: 'triz', data: {} },
      { id: 'e2', source: 'triz', target: 'cand-1a', data: {} },
      { id: 'e3', source: 'triz', target: 'cand-2a', data: {} },
      { id: 'e4', source: 'triz', target: 'cand-3a', data: {} },
      { id: 'e5', source: 'triz', target: 'cand-4a', data: {} },
      { id: 'e6', source: 'triz', target: 'cand-5a', data: {} },
      { id: 'e7', source: 'cand-1a', target: 'cand-1b', data: {} },
      { id: 'e8', source: 'cand-2a', target: 'cand-2b', data: {} },
      { id: 'e9', source: 'cand-3a', target: 'cand-3b', data: {} },
      { id: 'e10', source: 'cand-4a', target: 'cand-4b', data: {} },
      { id: 'e11', source: 'cand-5a', target: 'cand-5b', data: {} },
      { id: 'e12', source: 'cand-1b', target: 'choose', data: {} },
      { id: 'e13', source: 'cand-2b', target: 'choose', data: {} },
      { id: 'e14', source: 'cand-3b', target: 'choose', data: {} },
      { id: 'e15', source: 'cand-4b', target: 'choose', data: {} },
      { id: 'e16', source: 'cand-5b', target: 'choose', data: {} },
      { id: 'e17', source: 'choose', target: 'best', data: {} }
    ]
  });
}
