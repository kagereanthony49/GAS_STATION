import { useContext } from 'react'
import { AppContext } from './context.js'

export const useAppStore = () => useContext(AppContext)