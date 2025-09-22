
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter } from "lucide-react"

export default function BotoesEstoque() {
  return (
    <div className="p-8">
   
      <h1 className="text-2xl font-semibold">Estoque de produtos</h1>
      
      <Separator className="my-4" />
 
      <div className="flex items-center gap-3">

        <Input placeholder="Produto" className="w-48" />

      
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Peca-1">Peça-1</SelectItem>
            <SelectItem value="Peca-2">Peça-2</SelectItem>
            <SelectItem value="Peca-3">Peça-3</SelectItem>
          </SelectContent>
        </Select>

        {/* Input código */}
        <Input placeholder="Código do produto" className="w-48" />

        {/* Botão filtrar */}
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Filter className="mr-2 h-4 w-4" /> Filtrar
        </Button>

        {/* Espaço empurra botão cadastrar pra direita */}
        <div className="flex-1" />

        {/* Botão cadastrar */}
        <Button className="bg-green-600 hover:bg-green-700">
          Cadastrar
        </Button>
      </div>
    </div>
  )
}