import { LivrosResultado } from './../../../models/interface';
import { Component } from '@angular/core';
import { FormControl } from "@angular/forms";
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from "rxjs";
import { LivroService } from "src/app/service/livro.service";
import { Item, Livro } from "src/models/interface";
import { LivroVolumeInfo } from "src/models/livroVolumeInfo";

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {
  campoBusca = new FormControl()
  livro: Livro
  mensagemErro = ''
  livrosResultado: LivrosResultado

  constructor(private readonly service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges
    .pipe(
    debounceTime(300),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
        catchError(erro => {
            console.log(erro)
            return of()
        })
    )

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(300),
      filter((valorDigitado) => valorDigitado.length >= 3),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      map(resultado => this.livrosResultado = resultado),
      map(resultado => resultado.items ?? []),
      map((items) => this.livrosResultadoParaLivros(items)),
      catchError((erro) => {
        // this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'
        // return EMPTY
        console.log(erro)
        return throwError(() => new Error(this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'))
      })
    )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })

  }
}



