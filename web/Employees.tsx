import React, { useState, useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import { useSnackbar, SnackbarKey } from 'notistack'
import { DataGrid, GridColDef, GridToolbar, GridSortItem } from '@mui/x-data-grid'
import Avatar from './Avatar'
import AvatarEditor from 'react-avatar-edit'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

interface Emplyee {
  staffId: number
  staffName: string
  staffAge: number
  staffGender: number
  staffPicture: string
  staffEducation: string
  staffDepartment: string
  staffJob: string
}

interface PageData {
  content: Emplyee[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  pageable: {
    offset: number
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
  }
}

const GENDER_MAP = ['女', '男']
const mapGender = (value: string) => {
  if (!isNaN(+value)) return +value
  const i = GENDER_MAP.indexOf(value)
  return i === -1 ? 0 : i
}

const Users: React.FC = () => {
  const [employeesCount, setEmployeesCount] = useState(0)
  const [employees, setEmployees] = useState<Emplyee[]>([])
  const [sortModel, setSortModel] = useState<GridSortItem>()
  const [keyword, setKeyword] = useState<string>()
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarId, setAvatarId] = useState<number>()
  const [isLoading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number[]>([])
  const [snack, setSnack] = useState<SnackbarKey | null>(null)
  const [paginationModel, setPaginationModel] = React.useState({ pageSize: 20, page: 0 })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const numSelected = selected.length

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = `/api/employees?page=${paginationModel.page}&size=${paginationModel.pageSize}`
      if (sortModel != null) {
        url += `&sort=${sortModel.field}`
        if (sortModel.sort) url += `,${sortModel.sort}`
      }
      if (keyword) url += `&keyword=${keyword}`
      const data: PageData = await fetch(url).then(it => it.json())
      setEmployees(data.content)
      setEmployeesCount(data.totalElements)
      setLoading(false)
    } catch (e) {
      console.error(e)
      enqueueSnackbar('获取数据失败!', { variant: 'error' })
    }
  }

  useEffect(() => { fetchData() }, [paginationModel, sortModel, keyword])

  const columns: GridColDef<Emplyee>[] = [
    { field: 'staffId', headerName: 'ID', width: 50, filterable: false },
    {
      field: 'staffPicture',
      headerName: '头像',
      width: 60,
      disableColumnMenu: true,
      filterable: false,
      hideSortIcons: true,
      renderCell: ({ row, value }) => (<Avatar
        sx={{ cursor: 'pointer' }}
        alt={row.staffName}
        src={value}
        onClick={() => {
          setAvatar(null)
          setAvatarId(row.staffId)
        }}
      />)
    },
    {
      field: 'staffName',
      headerName: '姓名',
      width: 120,
      editable: true
    },
    {
      field: 'staffAge',
      headerName: '年龄',
      width: 70,
      type: 'number',
      editable: true,
      filterable: false
    },
    {
      field: 'staffGender',
      headerName: '性别',
      width: 50,
      valueGetter: ({ value }) => GENDER_MAP.includes(value) ? value : GENDER_MAP[(value % 2) || 0],
      editable: true,
      valueParser: mapGender,
      filterable: false
    },
    {
      field: 'staffEducation',
      headerName: '学历',
      width: 200,
      editable: true
    },
    {
      field: 'staffDepartment',
      headerName: '部门',
      width: 200,
      editable: true
    },
    {
      field: 'staffJob',
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
        onFilterModelChange={e => setKeyword(e.quickFilterValues?.[0])}
        onSortModelChange={e => setSortModel(e[0])}
        filterMode='server'
        sortingMode='server'
        paginationMode='server'
        paginationModel={paginationModel}
        rowCount={employeesCount}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ border: 0 }}
        getRowId={it => it.staffId}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 }
          }
        }}
        onRowSelectionModelChange={setSelected as any}
        rowSelectionModel={selected}
        loading={isLoading}
        processRowUpdate={async e => {
          if (typeof e.staffGender === 'string') e.staffGender = mapGender(e.staffGender || '0') || 0
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

      <Dialog open={avatarId != null} onClose={() => setAvatarId(undefined)}>
        <DialogTitle>上传头像</DialogTitle>
        <DialogContent>
          <AvatarEditor
            width={300}
            height={300}
            onCrop={setAvatar}
            onClose={() => setAvatar(null)}
            onBeforeFileLoad={e => {
              const files = e.target.files
              if (files && files[0].size > 1024 * 1024) {
                enqueueSnackbar('文件过大!', { variant: 'error' })
                e.preventDefault()
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarId(undefined)}>取消</Button>
          <Button
            disabled={!avatar}
            onClick={() => {
              setLoading(true)
              setAvatarId(undefined)
              const notify = enqueueSnackbar('上传中...', { variant: 'info', persist: true })
              fetch('/api/employee/avatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: avatarId, avatar })
              }).then(it => it.json()).then(it => {
                if (it.error) throw new Error(it.error)
                fetchData()
                enqueueSnackbar('上传成功!', { variant: 'success' })
              }).catch(() => {
                enqueueSnackbar('上传失败!', { variant: 'error' })
              }).finally(() => {
                closeSnackbar(notify)
                setLoading(false)
              })
            }}
          >确定</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default Users
