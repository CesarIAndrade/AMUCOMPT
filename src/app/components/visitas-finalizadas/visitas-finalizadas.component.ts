import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, Injectable, OnInit } from "@angular/core";
import { salir, openDialog } from "../../functions/global";
import { Router } from "@angular/router";

// Material
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { BehaviorSubject, Observable } from "rxjs";

// Services
import { SeguimientoService } from "src/app/services/seguimiento.service";
import { MatDialog } from "@angular/material";

const LOAD_MORE = "LOAD_MORE";

export class LoadmoreNode {
  childrenChange = new BehaviorSubject<LoadmoreNode[]>([]);

  get children(): LoadmoreNode[] {
    return this.childrenChange.value;
  }

  constructor(
    public item: string,
    public hasChildren = false,
    public loadMoreParentItem: string | null = null
  ) {}
}

export class LoadmoreFlatNode {
  constructor(
    public item: string,
    public level = 1,
    public expandable = false,
    public loadMoreParentItem: string | null = null
  ) {}
}

@Injectable()
export class LoadmoreDatabase {
  batchNumber = 5;
  dataChange = new BehaviorSubject<LoadmoreNode[]>([]);
  nodeMap = new Map<string, LoadmoreNode>();

  rootLevelNodes: string[] = [];
  dataMap = new Map<string, string[]>();

  recibirData(clientes) {
    clientes.map((cliente) => {
      var comunidades = [];
      var visitas = [];
      var nombres =
        cliente.PrimerNombre +
        " " +
        cliente.SegundoNombre +
        " " +
        cliente.ApellidoPaterno +
        " " +
        cliente.ApellidoMaterno;

      cliente.ListaComunidad.map((comunidad) => {
        comunidades.push(comunidad.Descripcion);
        comunidad.AsignarTecnicoPersonaComunidad.map((fecha) => {
          visitas.push(fecha.FechaFinalizacion);
        });
        this.dataMap.set(comunidad.Descripcion, visitas);
      });
      this.dataMap.set(nombres, comunidades);
      this.rootLevelNodes.push(nombres);
    });
    const data = this.rootLevelNodes.map((name) => this._generateNode(name));
    this.dataChange.next(data);
  }

  loadMore(item: string, onlyFirstTime = false) {
    if (!this.nodeMap.has(item) || !this.dataMap.has(item)) {
      return;
    }
    const parent = this.nodeMap.get(item)!;
    const children = this.dataMap.get(item)!;
    if (onlyFirstTime && parent.children!.length > 0) {
      return;
    }
    const newChildrenNumber = parent.children!.length + this.batchNumber;
    const nodes = children
      .slice(0, newChildrenNumber)
      .map((name) => this._generateNode(name));
    if (newChildrenNumber < children.length) {
      nodes.push(new LoadmoreNode(LOAD_MORE, false, item));
    }

    parent.childrenChange.next(nodes);
    this.dataChange.next(this.dataChange.value);
  }

  private _generateNode(item: string): LoadmoreNode {
    if (this.nodeMap.has(item)) {
      return this.nodeMap.get(item)!;
    }
    const result = new LoadmoreNode(item, this.dataMap.has(item));
    this.nodeMap.set(item, result);
    return result;
  }
}

@Component({
  selector: "app-visitas-finalizadas",
  templateUrl: "./visitas-finalizadas.component.html",
  styleUrls: ["./visitas-finalizadas.component.css"],
  providers: [LoadmoreDatabase],
})
export class VisitasFinalizadasComponent implements OnInit {
  async consultarVisitasFinalizadas() {
    var respuesta = await this.seguimientoService.consultarVisitasFinalizadas(
      localStorage.getItem("miCuenta.idAsignacionTipoUsuario")
    );
    if (respuesta["codigo"] == "200") {
      this._database.recibirData(respuesta["respuesta"]);
    } else if (respuesta["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir());
    }
  }

  ngOnInit() {
    this.consultarVisitasFinalizadas();
    this.seguimientoService.refresh$.subscribe(() => {
      this.consultarVisitasFinalizadas();
    });
  }

  nodeMap = new Map<string, LoadmoreFlatNode>();
  treeControl: FlatTreeControl<LoadmoreFlatNode>;
  treeFlattener: MatTreeFlattener<LoadmoreNode, LoadmoreFlatNode>;
  dataSource: MatTreeFlatDataSource<LoadmoreNode, LoadmoreFlatNode>;

  constructor(
    private _database: LoadmoreDatabase,
    private seguimientoService: SeguimientoService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );

    this.treeControl = new FlatTreeControl<LoadmoreFlatNode>(
      this.getLevel,
      this.isExpandable
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  getChildren = (node: LoadmoreNode): Observable<LoadmoreNode[]> =>
    node.childrenChange;

  transformer = (node: LoadmoreNode, level: number) => {
    const existingNode = this.nodeMap.get(node.item);

    if (existingNode) {
      return existingNode;
    }

    const newNode = new LoadmoreFlatNode(
      node.item,
      level,
      node.hasChildren,
      node.loadMoreParentItem
    );
    this.nodeMap.set(node.item, newNode);
    return newNode;
  };

  getLevel = (node: LoadmoreFlatNode) => node.level;

  isExpandable = (node: LoadmoreFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.expandable;

  isLoadMore = (_: number, _nodeData: LoadmoreFlatNode) =>
    _nodeData.item === LOAD_MORE;

  loadMore(item: string) {
    this._database.loadMore(item);
  }

  loadChildren(node: LoadmoreFlatNode) {
    this._database.loadMore(node.item, true);
  }
}
