"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"


//http://localhost:5011

interface Produto {
  _id: string,
  nome_produto: string,
  descricao: string,
  marca: string,
  custo: string,
  categoria: string,
  estoque: number,
  estoque_min: number,
  data_ultima_entrada: string
}

export default function ProdutosPage() {

  const [produtos, setProutos] = useState<Produto[]>([])
  const [erro, setErro] = useState<string | null>(null)

  async function fetchProdutos() {
    setErro(null)

    try {
      const response = await fetch('http://localhost:5011/api/produtos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer (AcessToken)`,
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      const data: Produto[] = result.data?.docs || result.data || []
      setProutos(data)
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
      setErro(`Erro ao buscar produtos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestão de Produtos</h1>

      <Button
        onClick={() => fetchProdutos()}
        className="mb-6"
      >
        Buscar Produtos na API
      </Button>

      {produtos.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Lista de Produtos ({produtos.length} itens)</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
                <TableHead className="text-right">Custo</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow key={produto._id}>
                  <TableCell className="font-medium">{produto.nome_produto}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>{produto.marca}</TableCell>
                  <TableCell className="text-right">{produto.estoque}</TableCell>
                  <TableCell className="text-right">R$ {produto.custo}</TableCell>
                  <TableCell className="max-w-xs truncate" title={produto.descricao}>
                    {produto.descricao}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}