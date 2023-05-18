import React, { useState, useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import { useSnackbar, SnackbarKey } from 'notistack'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import Avatar from './Avatar'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export interface Emplyee {
  staff_id: number
  staff_name: string
  staff_age: number
  staff_gender: number
  staff_picture: string
  staff_education: string
  staff_department: string
  staff_job: string
}

const GENDER_MAP = ['女', '男']
const mapGender = (value: string) => {
  if (!isNaN(+value)) return +value
  const i = GENDER_MAP.indexOf(value)
  return i === -1 ? 0 : i
}

const Users: React.FC = () => {
  const [employees, setEmployees] = useState<Emplyee[]>([])
  const [isLoading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number[]>([])
  const [snack, setSnack] = useState<SnackbarKey | null>(null)
  const [paginationModel, setPaginationModel] = React.useState({ pageSize: 20, page: 0 })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const numSelected = selected.length

  const fetchData = () => {
    setLoading(true)
    return fetch('/api/employees').then(it => it.json()).then(it => {
      setEmployees(it)
      setLoading(false)
    }).catch(e => {
      console.error(e)
      enqueueSnackbar('获取数据失败!', { variant: 'error' })
    })
  }

  useEffect(() => { fetchData() }, [])

  const columns: GridColDef<Emplyee>[] = [
    { field: 'staff_id', headerName: 'ID', width: 50 },
    {
      field: 'staff_picture',
      headerName: '头像',
      width: 60,
      disableColumnMenu: true,
      filterable: false,
      hideSortIcons: true,
      renderCell: ({ row }) => (<Avatar name={row.staff_name} url={row.staff_picture} />)
    },
    {
      field: 'staff_name',
      headerName: '姓名',
      width: 120,
      editable: true
    },
    {
      field: 'staff_age',
      headerName: '年龄',
      width: 70,
      type: 'number',
      editable: true
    },
    {
      field: 'staff_gender',
      headerName: '性别',
      width: 50,
      valueGetter: ({ value }) => GENDER_MAP.includes(value) ? value : GENDER_MAP[(value % 2) || 0],
      editable: true,
      valueParser: mapGender
    },
    {
      field: 'staff_education',
      headerName: '学历',
      width: 200,
      editable: true
    },
    {
      field: 'staff_department',
      headerName: '部门',
      width: 200,
      editable: true
    },
    {
      field: 'staff_job',
      headerName: '职位',
      width: 200,
      editable: true
    }
  ]

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
          })
        }}
      >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          员工管理
        </Typography>
        {numSelected > 0
          ? (<Tooltip title="删除">
            <IconButton
              disabled={snack !== null}
              onClick={async () => {
                setLoading(true)
                const notify = enqueueSnackbar('删除中...', { variant: 'info', persist: true })
                setSnack(notify)
                try {
                  await fetch('/api/employees', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: selected })
                  }).then(it => it.json()).then(it => {
                    if (it.error) throw new Error(it.error)
                  })
                  fetchData()
                  enqueueSnackbar('操作成功!', { variant: 'success' })
                } catch (e) {
                  enqueueSnackbar('操作失败!', { variant: 'error' })
                }
                setSnack(null)
                closeSnackbar(notify)
                setLoading(false)
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>)
          : (<Tooltip title="添加">
            <IconButton
              onClick={() => {
                setLoading(true)
                fetch('/api/employee', { method: 'PUT' }).then(it => it.json()).then(it => {
                  if (it.error) {
                    console.error(it.error)
                    enqueueSnackbar('创建失败!', { variant: 'error' })
                    return
                  }
                  return fetchData().then(() => {
                    setPaginationModel(({ pageSize }) => ({ pageSize, page: Math.ceil(employees.length / pageSize) - 1 }))
                    enqueueSnackbar('创建成功!', { variant: 'success' })
                  })
                }).finally(() => setLoading(false))
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>)
        }
      </Toolbar>
      <DataGrid
        rows={employees}
        columns={columns}
        autoHeight
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ border: 0 }}
        getRowId={it => it.staff_id}
        slots={{ toolbar: GridToolbar }}
        onRowSelectionModelChange={setSelected as any}
        rowSelectionModel={selected}
        loading={isLoading}
        processRowUpdate={async e => {
          if (typeof e.staff_gender === 'string') e.staff_gender = mapGender(e.staff_gender || '0') || 0
          await fetch('/api/employee', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(e)
          }).then(it => it.json()).then(it => {
            if (it.error) {
              console.error(it.error)
              enqueueSnackbar('更新失败!', { variant: 'error' })
            }
          }).catch(console.error)
          return e
        }}
      />
    </Paper>
  )
}

export default Users
