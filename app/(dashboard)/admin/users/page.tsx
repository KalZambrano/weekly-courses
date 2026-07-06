'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchApi } from '@/lib/api'
import { getAllStudents, getAllAssistants } from '@/services/services'
import { 
  Users, 
  GraduationCap, 
  UserPlus, 
  Search, 
  Check, 
  X, 
  Phone, 
  Hash, 
  Mail, 
  User, 
  Pencil, 
  Trash2, 
  Loader2 
} from 'lucide-react'

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'admins'>('students')
  const [students, setStudents] = useState<any[]>([])
  const [assistants, setAssistants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [tick, setTick] = useState(0)
  const [tcRole, setTcRole] = useState<'ADMIN' | 'ASISTENTE'>('ASISTENTE')

  // Modales de Creación
  const [isStudentOpen, setIsStudentOpen] = useState(false)
  const [isTeacherOpen, setIsTeacherOpen] = useState(false)

  // Modales de Edición
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false)
  const [isEditTeacherOpen, setIsEditTeacherOpen] = useState(false)

  // Estados del Formulario de Estudiante (Creación)
  const [stName, setStName] = useState('')
  const [stPaternal, setStPaternal] = useState('')
  const [stMaternal, setStMaternal] = useState('')
  const [stDni, setStDni] = useState('')
  const [stPhone, setStPhone] = useState('')
  const [stEmail, setStEmail] = useState('')
  const [submittingSt, setSubmittingSt] = useState(false)

  // Estados del Formulario de Estudiante (Edición)
  const [editStId, setEditStId] = useState<number | null>(null)
  const [editStName, setEditStName] = useState('')
  const [editStPaternal, setEditStPaternal] = useState('')
  const [editStMaternal, setEditStMaternal] = useState('')
  const [editStDni, setEditStDni] = useState('')
  const [editStPhone, setEditStPhone] = useState('')
  const [editStEmail, setEditStEmail] = useState('')
  const [editStEnabled, setEditStEnabled] = useState(true)
  const [editStPassword, setEditStPassword] = useState('')
  const [submittingEditSt, setSubmittingEditSt] = useState(false)

  // Estados del Formulario de Docente (Creación)
  const [tcName, setTcName] = useState('')
  const [tcPaternal, setTcPaternal] = useState('')
  const [tcMaternal, setTcMaternal] = useState('')
  const [tcDni, setTcDni] = useState('')
  const [tcPhone, setTcPhone] = useState('')
  const [tcEmail, setTcEmail] = useState('')
  const [tcPassword, setTcPassword] = useState('')
  const [submittingTc, setSubmittingTc] = useState(false)

  // Estados del Formulario de Docente (Edición)
  const [editTcId, setEditTcId] = useState<number | null>(null)
  const [editTcName, setEditTcName] = useState('')
  const [editTcPaternal, setEditTcPaternal] = useState('')
  const [editTcMaternal, setEditTcMaternal] = useState('')
  const [editTcDni, setEditTcDni] = useState('')
  const [editTcPhone, setEditTcPhone] = useState('')
  const [editTcEmail, setEditTcEmail] = useState('')
  const [editTcRole, setEditTcRole] = useState<'ADMIN' | 'ASISTENTE'>('ADMIN')
  const [editTcEnabled, setEditTcEnabled] = useState(true)
  const [editTcPassword, setEditTcPassword] = useState('')
  const [submittingEditTc, setSubmittingEditTc] = useState(false)

  // Estados de error para validaciones visuales
  const [errCreateSt, setErrCreateSt] = useState<any>({})
  const [errEditSt, setErrEditSt] = useState<any>({})
  const [errCreateTc, setErrCreateTc] = useState<any>({})
  const [errEditTc, setErrEditTc] = useState<any>({})

  useEffect(() => {
    if (!isStudentOpen) setErrCreateSt({})
  }, [isStudentOpen])

  useEffect(() => {
    if (!isTeacherOpen) setErrCreateTc({})
  }, [isTeacherOpen])

  useEffect(() => {
    if (!isEditStudentOpen) setErrEditSt({})
  }, [isEditStudentOpen])

  useEffect(() => {
    if (!isEditTeacherOpen) setErrEditTc({})
  }, [isEditTeacherOpen])

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const [allSts, allAsis] = await Promise.all([
          getAllStudents(),
          getAllAssistants()
        ])
        setStudents(allSts)
        setAssistants(allAsis)
      } catch (error) {
        console.error("Error loading users:", error)
        toast.error("Error al cargar los usuarios del servidor")
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [tick])

  // Validaciones RegEx comunes
  const validateDni = (dni: string) => /^\d{8}$/.test(dni)
  const validatePhone = (phone: string) => /^\d{9}$/.test(phone)
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // Handlers para Crear Estudiante
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrCreateSt({})
    const newErrors: any = {}
    if (!stName.trim()) newErrors.stName = "Los nombres son obligatorios."
    if (!stPaternal.trim()) newErrors.stPaternal = "El apellido paterno es obligatorio."
    if (!stMaternal.trim()) newErrors.stMaternal = "El apellido materno es obligatorio."
    if (!validateDni(stDni)) newErrors.stDni = "El DNI debe contener exactamente 8 números."
    if (!validatePhone(stPhone)) newErrors.stPhone = "El Celular debe contener exactamente 9 números."
    if (!validateEmail(stEmail)) newErrors.stEmail = "Ingresa un formato de correo electrónico válido."

    if (Object.keys(newErrors).length > 0) {
      setErrCreateSt(newErrors)
      toast.error("Por favor completa los campos correctamente.")
      return
    }

    setSubmittingSt(true)
    const fullName = stName.trim()
    const fullSurnames = `${stPaternal.trim()} ${stMaternal.trim()}`

    try {
      await fetchApi('/Estudiantes/addEstudiante', {
        method: 'POST',
        body: JSON.stringify({
          nombreEstudiante: fullName,
          apellidoEstudiante: fullSurnames,
          dniEstudiante: stDni,
          correoEstudiante: stEmail,
          habilitadoEstudiante: true,
          rolEstudiante: 'ESTUDIANTE',
          passwordEstudiante: 'student123'
        })
      })

      toast.success("¡Estudiante creado con éxito!", {
        description: `Se registró a ${fullName} con contraseña temporal 'student123'.`
      })

      setStName('')
      setStPaternal('')
      setStMaternal('')
      setStDni('')
      setStPhone('')
      setStEmail('')
      setIsStudentOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al registrar el estudiante en el servidor.")
    } finally {
      setSubmittingSt(false)
    }
  }

  // Handlers para Editar Estudiante
  const openEditStudent = (st: any) => {
    setErrEditSt({})
    setEditStId(st.id)
    setEditStName(st.nombreEstudiante)
    // Extraer apellidos
    const parts = (st.apellidoEstudiante || "").split(" ")
    setEditStPaternal(parts[0] || "")
    setEditStMaternal(parts.slice(1).join(" ") || "")
    setEditStDni(st.dniEstudiante)
    setEditStPhone('987654321') // Mock/Default since database does not hold phone
    setEditStEmail(st.correoEstudiante)
    setEditStEnabled(st.habilitadoEstudiante)
    setEditStPassword('')
    setIsEditStudentOpen(true)
  }

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrEditSt({})
    const newErrors: any = {}
    if (!editStName.trim()) newErrors.editStName = "Los nombres son obligatorios."
    if (!editStPaternal.trim()) newErrors.editStPaternal = "El apellido paterno es obligatorio."
    if (!editStMaternal.trim()) newErrors.editStMaternal = "El apellido materno es obligatorio."
    if (!validateDni(editStDni)) newErrors.editStDni = "El DNI debe contener exactamente 8 números."
    if (!validatePhone(editStPhone)) newErrors.editStPhone = "El Celular debe contener exactamente 9 números."
    if (!validateEmail(editStEmail)) newErrors.editStEmail = "Ingresa un formato de correo electrónico válido."

    if (Object.keys(newErrors).length > 0) {
      setErrEditSt(newErrors)
      toast.error("Por favor completa los campos correctamente.")
      return
    }

    setSubmittingEditSt(true)
    const fullName = editStName.trim()
    const fullSurnames = `${editStPaternal.trim()} ${editStMaternal.trim()}`

    try {
      await fetchApi(`/Estudiantes/updateEstudiante/${editStId}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombreEstudiante: fullName,
          apellidoEstudiante: fullSurnames,
          dniEstudiante: editStDni,
          correoEstudiante: editStEmail,
          habilitadoEstudiante: editStEnabled,
          rolEstudiante: 'ESTUDIANTE',
          passwordEstudiante: editStPassword || null
        })
      })

      toast.success("¡Estudiante actualizado con éxito!", {
        description: `Se modificaron los datos de ${fullName}.`
      })

      setIsEditStudentOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al actualizar estudiante en el servidor.")
    } finally {
      setSubmittingEditSt(false)
    }
  }

  const handleDeleteStudentLocal = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar de forma permanente este estudiante del sistema?")) return
    try {
      await fetchApi(`/Estudiantes/deleteEstudiante?id=${id}`, {
        method: 'DELETE'
      })
      toast.success("Estudiante eliminado con éxito.")
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al eliminar estudiante.")
    }
  }

  // Handlers para Crear Docente
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrCreateTc({})
    const newErrors: any = {}
    if (!tcName.trim()) newErrors.tcName = "Los nombres son obligatorios."
    if (!tcPaternal.trim()) newErrors.tcPaternal = "El apellido paterno es obligatorio."
    if (!tcMaternal.trim()) newErrors.tcMaternal = "El apellido materno es obligatorio."
    if (!validateDni(tcDni)) newErrors.tcDni = "El DNI debe contener exactamente 8 números."
    if (!validatePhone(tcPhone)) newErrors.tcPhone = "El Celular debe contener exactamente 9 números."
    if (!validateEmail(tcEmail)) newErrors.tcEmail = "Ingresa un formato de correo electrónico válido."
    if (tcPassword.length < 4) newErrors.tcPassword = "La contraseña debe tener al menos 4 caracteres."

    if (Object.keys(newErrors).length > 0) {
      setErrCreateTc(newErrors)
      toast.error("Por favor completa los campos correctamente.")
      return
    }

    setSubmittingTc(true)
    const fullName = tcName.trim()
    const fullSurnames = `${tcPaternal.trim()} ${tcMaternal.trim()}`

    try {
      await fetchApi('/asistentes/addAsistentes', {
        method: 'POST',
        body: JSON.stringify({
          nombreEmpleado: fullName,
          apellidoEmpleado: fullSurnames,
          dniEmpleado: tcDni,
          correoEmpleado: tcEmail,
          passwordEmpleado: tcPassword,
          rolesEmpleado: tcRole
        })
      })

      const roleLabel = tcRole === 'ADMIN' ? 'Administrador' : 'Docente'
      toast.success(`¡${roleLabel} creado con éxito!`, {
        description: `Se registró al ${roleLabel.toLowerCase()} ${fullName} correctamente.`
      })

      setTcName('')
      setTcPaternal('')
      setTcMaternal('')
      setTcDni('')
      setTcPhone('')
      setTcEmail('')
      setTcPassword('')
      setIsTeacherOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al registrar el docente en el servidor.")
    } finally {
      setSubmittingTc(false)
    }
  }

  // Handlers para Editar Docente
  const openEditTeacher = (tc: any) => {
    setErrEditTc({})
    setEditTcId(tc.id)
    setEditTcName(tc.nombreEmpleado)
    const parts = (tc.apellidoEmpleado || "").split(" ")
    setEditTcPaternal(parts[0] || "")
    setEditTcMaternal(parts.slice(1).join(" ") || "")
    setEditTcDni(tc.dniEmpleado)
    setEditTcPhone('987654321')
    setEditTcEmail(tc.correoEmpleado)
    setEditTcRole(tc.rolesEmpleado)
    setEditTcEnabled(tc.habilitadoEmpleado)
    setEditTcPassword('')
    setIsEditTeacherOpen(true)
  }

  const handleEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrEditTc({})
    const newErrors: any = {}
    if (!editTcName.trim()) newErrors.editTcName = "Los nombres son obligatorios."
    if (!editTcPaternal.trim()) newErrors.editTcPaternal = "El apellido paterno es obligatorio."
    if (!editTcMaternal.trim()) newErrors.editTcMaternal = "El apellido materno es obligatorio."
    if (!validateDni(editTcDni)) newErrors.editTcDni = "El DNI debe contener exactamente 8 números."
    if (!validatePhone(editTcPhone)) newErrors.editTcPhone = "El Celular debe contener exactamente 9 números."
    if (!validateEmail(editTcEmail)) newErrors.editTcEmail = "Ingresa un formato de correo electrónico válido."

    if (Object.keys(newErrors).length > 0) {
      setErrEditTc(newErrors)
      toast.error("Por favor completa los campos correctamente.")
      return
    }

    setSubmittingEditTc(true)
    const fullName = editTcName.trim()
    const fullSurnames = `${editTcPaternal.trim()} ${editTcMaternal.trim()}`

    try {
      await fetchApi(`/asistentes/updateAsistentes/${editTcId}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombreEmpleado: fullName,
          apellidoEmpleado: fullSurnames,
          dniEmpleado: editTcDni,
          correoEmpleado: editTcEmail,
          passwordEmpleado: editTcPassword || null,
          rolesEmpleado: editTcRole
        })
      })

      toast.success("¡Docente/Asistente actualizado con éxito!", {
        description: `Se modificaron los datos de ${fullName}.`
      })

      setIsEditTeacherOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al actualizar docente en el servidor.")
    } finally {
      setSubmittingEditTc(false)
    }
  }

  const handleDeleteTeacherLocal = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar de forma permanente este docente/asistente?")) return
    try {
      await fetchApi(`/asistentes/deleteAsistentes?id=${id}`, {
        method: 'DELETE'
      })
      toast.success("Docente/Asistente eliminado con éxito.")
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al eliminar docente/asistente.")
    }
  }

  const filteredStudents = students.filter(s => 
    `${s.nombreEstudiante} ${s.apellidoEstudiante}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.dniEstudiante.includes(searchQuery) ||
    s.correoEstudiante.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTeachers = assistants.filter(t => 
    t.rolesEmpleado === 'ASISTENTE' && (
      `${t.nombreEmpleado} ${t.apellidoEmpleado}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.dniEmpleado.includes(searchQuery) ||
      t.correoEmpleado.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const filteredAdmins = assistants.filter(t => 
    t.rolesEmpleado === 'ADMIN' && (
      `${t.nombreEmpleado} ${t.apellidoEmpleado}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.dniEmpleado.includes(searchQuery) ||
      t.correoEmpleado.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="size-8 text-blue-700" />
            Gestión de Usuarios
          </h1>
          <p className="mt-2 text-slate-500">
            Administra de manera manual a los estudiantes, docentes y asistentes de la plataforma.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsStudentOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 gap-2 shadow-sm"
          >
            <UserPlus className="size-4" />
            Nuevo Estudiante
          </Button>
          <Button 
            onClick={() => {
              setTcRole('ASISTENTE')
              setIsTeacherOpen(true)
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl h-11 gap-2 shadow-sm"
          >
            <UserPlus className="size-4" />
            Nuevo Docente
          </Button>
          <Button 
            onClick={() => {
              setTcRole('ADMIN')
              setIsTeacherOpen(true)
            }}
            className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl h-11 gap-2 shadow-sm"
          >
            <UserPlus className="size-4" />
            Nuevo Administrador
          </Button>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por DNI, Nombre o Correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200"
          />
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(v) => {
            setActiveTab(v as any)
            setSearchQuery('')
          }}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-slate-200/60 p-1 rounded-xl w-full justify-center">
            <TabsTrigger value="students" className="rounded-lg px-6 py-2 text-sm font-semibold">
              Estudiantes
            </TabsTrigger>
            <TabsTrigger value="teachers" className="rounded-lg px-6 py-2 text-sm font-semibold">
              Docentes
            </TabsTrigger>
            <TabsTrigger value="admins" className="rounded-lg px-6 py-2 text-sm font-semibold">
              Administradores
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Table Content */}
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex py-20 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-blue-700" />
              <span className="ml-3 text-slate-500 font-medium">Cargando lista de usuarios...</span>
            </div>
          ) : activeTab === 'students' ? (
            <Table>
              <TableHeader className="bg-slate-100/50">
                <TableRow>
                  <TableHead className="text-slate-600 font-semibold">DNI</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Nombres y Apellidos</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Correo Electrónico</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Rol</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Estado</TableHead>
                  <TableHead className="text-slate-600 font-semibold text-center w-28">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((st) => (
                    <TableRow key={st.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-slate-700">{st.dniEstudiante}</TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {st.nombreEstudiante} {st.apellidoEstudiante}
                      </TableCell>
                      <TableCell className="text-slate-600">{st.correoEstudiante}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-250 rounded-lg py-1 px-2.5">
                          {st.rolEstudiante === 'ESTUDIANTE' ? 'Estudiante' : st.rolEstudiante}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {st.habilitadoEstudiante ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-lg py-1 px-2.5">
                            Habilitado
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="rounded-lg py-1 px-2.5">
                            Inhabilitado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditStudent(st)}
                            className="text-slate-400 hover:text-blue-700 transition-colors"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteStudentLocal(st.id)}
                            className="text-slate-400 hover:text-red-650 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                      No se encontraron estudiantes que coincidan con la búsqueda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : activeTab === 'teachers' ? (
            <Table>
              <TableHeader className="bg-slate-100/50">
                <TableRow>
                  <TableHead className="text-slate-600 font-semibold">DNI</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Nombres y Apellidos</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Correo Electrónico</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Rol</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Estado</TableHead>
                  <TableHead className="text-slate-600 font-semibold text-center w-28">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((tc) => (
                    <TableRow key={tc.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-slate-700">{tc.dniEmpleado}</TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {tc.nombreEmpleado} {tc.apellidoEmpleado}
                      </TableCell>
                      <TableCell className="text-slate-600">{tc.correoEmpleado}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-lg py-1 px-2.5 font-medium">
                          {tc.rolesEmpleado === 'ADMIN' ? 'Docente' : tc.rolesEmpleado === 'ASISTENTE' ? 'Docente' : tc.rolesEmpleado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tc.habilitado ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-lg py-1 px-2.5">
                            Habilitado
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="rounded-lg py-1 px-2.5">
                            Inhabilitado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditTeacher(tc)}
                            className="text-slate-400 hover:text-blue-700 transition-colors"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteTeacherLocal(tc.id)}
                            className="text-slate-400 hover:text-red-650 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                      No se encontraron docentes que coincidan con la búsqueda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader className="bg-slate-100/50">
                <TableRow>
                  <TableHead className="text-slate-600 font-semibold">DNI</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Nombres y Apellidos</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Correo Electrónico</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Rol</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Estado</TableHead>
                  <TableHead className="text-slate-600 font-semibold text-center w-28">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((tc) => (
                    <TableRow key={tc.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-slate-700">{tc.dniEmpleado}</TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {tc.nombreEmpleado} {tc.apellidoEmpleado}
                      </TableCell>
                      <TableCell className="text-slate-600">{tc.correoEmpleado}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-900 text-white rounded-lg py-1 px-2.5 font-medium">
                          Administrador
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tc.habilitado ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-lg py-1 px-2.5">
                            Habilitado
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="rounded-lg py-1 px-2.5">
                            Inhabilitado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditTeacher(tc)}
                            className="text-slate-400 hover:text-blue-700 transition-colors"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteTeacherLocal(tc.id)}
                            className="text-slate-400 hover:text-red-650 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                      No se encontraron administradores que coincidan con la búsqueda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal: Crear Estudiante */}
      <Dialog open={isStudentOpen} onOpenChange={setIsStudentOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <GraduationCap className="size-6 text-emerald-600" />
              Nuevo Estudiante
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Registra un nuevo estudiante. La contraseña por defecto de acceso se configurará en <strong className="text-slate-700">student123</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateStudent} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="st-name" className="text-slate-600 font-medium">Nombres</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="st-name"
                  placeholder="Ej. Juan Carlos"
                  value={stName}
                  onChange={(e) => setStName(e.target.value)}
                  required
                  className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateSt.stName ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
              </div>
              {errCreateSt.stName && <p className="text-red-500 text-xs">{errCreateSt.stName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="st-paternal" className="text-slate-600 font-medium">Ap. Paterno</Label>
                <Input
                  id="st-paternal"
                  placeholder="Ej. Pérez"
                  value={stPaternal}
                  onChange={(e) => setStPaternal(e.target.value)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateSt.stPaternal ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errCreateSt.stPaternal && <p className="text-red-500 text-xs">{errCreateSt.stPaternal}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="st-maternal" className="text-slate-600 font-medium">Ap. Materno</Label>
                <Input
                  id="st-maternal"
                  placeholder="Ej. Rodríguez"
                  value={stMaternal}
                  onChange={(e) => setStMaternal(e.target.value)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateSt.stMaternal ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errCreateSt.stMaternal && <p className="text-red-500 text-xs">{errCreateSt.stMaternal}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="st-dni" className="text-slate-600 font-medium">DNI (8 dígitos)</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="st-dni"
                    placeholder="87654321"
                    maxLength={8}
                    value={stDni}
                    onChange={(e) => setStDni(e.target.value.replace(/\D/g, ''))}
                    required
                    className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateSt.stDni ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errCreateSt.stDni && <p className="text-red-500 text-xs">{errCreateSt.stDni}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="st-phone" className="text-slate-600 font-medium">Celular (9 dígitos)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="st-phone"
                    placeholder="987654321"
                    maxLength={9}
                    value={stPhone}
                    onChange={(e) => setStPhone(e.target.value.replace(/\D/g, ''))}
                    required
                    className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateSt.stPhone ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errCreateSt.stPhone && <p className="text-red-500 text-xs">{errCreateSt.stPhone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="st-email" className="text-slate-600 font-medium">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="st-email"
                  type="email"
                  placeholder="estudiante@utp.edu.pe"
                  value={stEmail}
                  onChange={(e) => setStEmail(e.target.value)}
                  required
                  className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateSt.stEmail ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
              </div>
              {errCreateSt.stEmail && <p className="text-red-500 text-xs">{errCreateSt.stEmail}</p>}
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsStudentOpen(false)}
                className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 gap-1"
              >
                <X className="size-4" /> Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submittingSt}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
              >
                {submittingSt ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Check className="size-4" /> Crear Estudiante
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Estudiante */}
      <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <Pencil className="size-5 text-blue-750" />
              Editar Estudiante
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Modifica los datos del estudiante. Si dejas el campo de contraseña vacío, se mantendrá la actual.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditStudent} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-st-name" className="text-slate-600 font-medium">Nombres</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="edit-st-name"
                  placeholder="Ej. Juan Carlos"
                  value={editStName}
                  onChange={(e) => setEditStName(e.target.value)}
                  required
                  className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditSt.editStName ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
              </div>
              {errEditSt.editStName && <p className="text-red-500 text-xs">{errEditSt.editStName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-st-paternal" className="text-slate-600 font-medium">Ap. Paterno</Label>
                <Input
                  id="edit-st-paternal"
                  placeholder="Ej. Pérez"
                  value={editStPaternal}
                  onChange={(e) => setEditStPaternal(e.target.value)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditSt.editStPaternal ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errEditSt.editStPaternal && <p className="text-red-500 text-xs">{errEditSt.editStPaternal}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-st-maternal" className="text-slate-600 font-medium">Ap. Materno</Label>
                <Input
                  id="edit-st-maternal"
                  placeholder="Ej. Rodríguez"
                  value={editStMaternal}
                  onChange={(e) => setEditStMaternal(e.target.value)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditSt.editStMaternal ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errEditSt.editStMaternal && <p className="text-red-500 text-xs">{errEditSt.editStMaternal}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-st-dni" className="text-slate-600 font-medium">DNI (8 dígitos)</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="edit-st-dni"
                    placeholder="87654321"
                    maxLength={8}
                    value={editStDni}
                    onChange={(e) => setEditStDni(e.target.value.replace(/\D/g, ''))}
                    required
                    className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditSt.editStDni ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errEditSt.editStDni && <p className="text-red-500 text-xs">{errEditSt.editStDni}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-st-phone" className="text-slate-600 font-medium">Celular (9 dígitos)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="edit-st-phone"
                    placeholder="987654321"
                    maxLength={9}
                    value={editStPhone}
                    onChange={(e) => setEditStPhone(e.target.value.replace(/\D/g, ''))}
                    required
                    className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditSt.editStPhone ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errEditSt.editStPhone && <p className="text-red-500 text-xs">{errEditSt.editStPhone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-st-email" className="text-slate-600 font-medium">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="edit-st-email"
                  type="email"
                  placeholder="estudiante@utp.edu.pe"
                  value={editStEmail}
                  onChange={(e) => setEditStEmail(e.target.value)}
                  required
                  className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditSt.editStEmail ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
              </div>
              {errEditSt.editStEmail && <p className="text-red-500 text-xs">{errEditSt.editStEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-st-pass" className="text-slate-600 font-medium">Nueva Contraseña (Opcional)</Label>
              <Input
                id="edit-st-pass"
                type="password"
                placeholder="Ingresar para cambiar"
                value={editStPassword}
                onChange={(e) => setEditStPassword(e.target.value)}
                className="rounded-xl border-slate-200 focus-visible:ring-blue-200"
              />
            </div>

            <div className="flex items-center justify-between py-2 rounded-xl bg-slate-50 px-3 border border-slate-100">
              <Label htmlFor="edit-st-enabled" className="text-slate-700 font-medium cursor-pointer">Estudiante Habilitado</Label>
              <Switch
                id="edit-st-enabled"
                checked={editStEnabled}
                onCheckedChange={setEditStEnabled}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditStudentOpen(false)}
                className="rounded-xl border-slate-200 text-slate-750 gap-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submittingEditSt}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl gap-2"
              >
                {submittingEditSt ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Crear Docente / Administrador */}
      <Dialog open={isTeacherOpen} onOpenChange={setIsTeacherOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <Users className="size-6 text-blue-700" />
              {tcRole === 'ADMIN' ? 'Nuevo Administrador' : 'Nuevo Docente'}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {tcRole === 'ADMIN' 
                ? 'Registra un nuevo administrador con acceso total al panel del sistema.' 
                : 'Registra un nuevo docente para el dictado y gestión de materiales.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTeacher} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tc-name" className="text-slate-600 font-medium">Nombres</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="tc-name"
                  placeholder="Ej. María Elena"
                  value={tcName}
                  onChange={(e) => setTcName(e.target.value)}
                  required
                  className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateTc.tcName ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
              </div>
              {errCreateTc.tcName && <p className="text-red-500 text-xs">{errCreateTc.tcName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tc-paternal" className="text-slate-600 font-medium">Ap. Paterno</Label>
                <Input
                  id="tc-paternal"
                  placeholder="Ej. Gómez"
                  value={tcPaternal}
                  onChange={(e) => setTcPaternal(e.target.value)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateTc.tcPaternal ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errCreateTc.tcPaternal && <p className="text-red-500 text-xs">{errCreateTc.tcPaternal}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tc-maternal" className="text-slate-600 font-medium">Ap. Materno</Label>
                <Input
                  id="tc-maternal"
                  placeholder="Ej. Mendoza"
                  value={tcMaternal}
                  onChange={(e) => setTcMaternal(e.target.value)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateTc.tcMaternal ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errCreateTc.tcMaternal && <p className="text-red-500 text-xs">{errCreateTc.tcMaternal}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tc-dni" className="text-slate-600 font-medium">DNI (8 dígitos)</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="tc-dni"
                    placeholder="87654321"
                    maxLength={8}
                    value={tcDni}
                    onChange={(e) => setTcDni(e.target.value.replace(/\D/g, ''))}
                    required
                    className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateTc.tcDni ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errCreateTc.tcDni && <p className="text-red-500 text-xs">{errCreateTc.tcDni}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tc-phone" className="text-slate-600 font-medium">Celular (9 dígitos)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="tc-phone"
                    placeholder="987654321"
                    maxLength={9}
                    value={tcPhone}
                    onChange={(e) => setTcPhone(e.target.value.replace(/\D/g, ''))}
                    required
                    className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateTc.tcPhone ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errCreateTc.tcPhone && <p className="text-red-500 text-xs">{errCreateTc.tcPhone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tc-email" className="text-slate-600 font-medium">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="tc-email"
                  type="email"
                  placeholder="docente@gmail.com"
                  value={tcEmail}
                  onChange={(e) => setTcEmail(e.target.value)}
                  required
                  className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateTc.tcEmail ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
              </div>
              {errCreateTc.tcEmail && <p className="text-red-500 text-xs">{errCreateTc.tcEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tc-pass" className="text-slate-600 font-medium">Contraseña Inicial</Label>
              <Input
                id="tc-pass"
                type="password"
                placeholder="••••••••"
                value={tcPassword}
                onChange={(e) => setTcPassword(e.target.value)}
                required
                className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateTc.tcPassword ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
              />
              {errCreateTc.tcPassword && <p className="text-red-500 text-xs">{errCreateTc.tcPassword}</p>}
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsTeacherOpen(false)}
                className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 gap-1"
              >
                <X className="size-4" /> Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submittingTc}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl gap-2"
              >
                {submittingTc ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Check className="size-4" /> {tcRole === 'ADMIN' ? 'Crear Administrador' : 'Crear Docente'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Docente/Asistente */}
      <Dialog open={isEditTeacherOpen} onOpenChange={setIsEditTeacherOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <Pencil className="size-5 text-blue-750" />
              Editar Docente / Asistente
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Modifica los datos del docente. Si dejas la contraseña en blanco, se mantendrá la actual.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditTeacher} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tc-name" className="text-slate-600 font-medium">Nombres</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="edit-tc-name"
                  placeholder="Ej. María Elena"
                  value={editTcName}
                  onChange={(e) => setEditTcName(e.target.value)}
                  required
                  className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditTc.editTcName ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
              </div>
              {errEditTc.editTcName && <p className="text-red-500 text-xs">{errEditTc.editTcName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tc-paternal" className="text-slate-600 font-medium">Ap. Paterno</Label>
                <Input
                  id="edit-tc-paternal"
                  placeholder="Ej. Gómez"
                  value={editTcPaternal}
                  onChange={(e) => setEditTcPaternal(e.target.value)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditTc.editTcPaternal ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errEditTc.editTcPaternal && <p className="text-red-500 text-xs">{errEditTc.editTcPaternal}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tc-maternal" className="text-slate-600 font-medium">Ap. Materno</Label>
                <Input
                  id="edit-tc-maternal"
                  placeholder="Ej. Mendoza"
                  value={editTcMaternal}
                  onChange={(e) => setEditTcMaternal(e.target.value)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditTc.editTcMaternal ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errEditTc.editTcMaternal && <p className="text-red-500 text-xs">{errEditTc.editTcMaternal}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tc-dni" className="text-slate-600 font-medium">DNI (8 dígitos)</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="edit-tc-dni"
                    placeholder="87654321"
                    maxLength={8}
                    value={editTcDni}
                    onChange={(e) => setEditTcDni(e.target.value.replace(/\D/g, ''))}
                    required
                    className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditTc.editTcDni ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errEditTc.editTcDni && <p className="text-red-500 text-xs">{errEditTc.editTcDni}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tc-phone" className="text-slate-600 font-medium">Celular (9 dígitos)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="edit-tc-phone"
                    placeholder="987654321"
                    maxLength={9}
                    value={editTcPhone}
                    onChange={(e) => setEditTcPhone(e.target.value.replace(/\D/g, ''))}
                    required
                    className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditTc.editTcPhone ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errEditTc.editTcPhone && <p className="text-red-500 text-xs">{errEditTc.editTcPhone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tc-email" className="text-slate-600 font-medium">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="edit-tc-email"
                  type="email"
                  placeholder="docente@gmail.com"
                  value={editTcEmail}
                  onChange={(e) => setEditTcEmail(e.target.value)}
                  required
                  className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditTc.editTcEmail ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
              </div>
              {errEditTc.editTcEmail && <p className="text-red-500 text-xs">{errEditTc.editTcEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tc-role" className="text-slate-600 font-medium">Rol del Empleado</Label>
              <Select value={editTcRole} onValueChange={(v) => setEditTcRole(v as any)}>
                <SelectTrigger className="rounded-xl border-slate-200 focus-visible:ring-blue-200">
                  <SelectValue placeholder="Selecciona un rol..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Docente (ADMIN)</SelectItem>
                  <SelectItem value="ASISTENTE">Asistente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tc-pass" className="text-slate-600 font-medium">Nueva Contraseña (Opcional)</Label>
              <Input
                id="edit-tc-pass"
                type="password"
                placeholder="Ingresar para cambiar"
                value={editTcPassword}
                onChange={(e) => setEditTcPassword(e.target.value)}
                className="rounded-xl border-slate-200 focus-visible:ring-blue-200"
              />
            </div>

            <div className="flex items-center justify-between py-2 rounded-xl bg-slate-50 px-3 border border-slate-100">
              <Label htmlFor="edit-tc-enabled" className="text-slate-700 font-medium cursor-pointer">Empleado Habilitado</Label>
              <Switch
                id="edit-tc-enabled"
                checked={editTcEnabled}
                onCheckedChange={setEditTcEnabled}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditTeacherOpen(false)}
                className="rounded-xl border-slate-200 text-slate-750"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submittingEditTc}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl gap-2"
              >
                {submittingEditTc ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
