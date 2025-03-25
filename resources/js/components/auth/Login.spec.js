import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import Login from '../auth/LoginModal.vue'

// Mock axios
vi.mock('axios')

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Login Component', () => {
  const defaultProps = {
    show: true
  }

  // Helper function to create a wrapper with props
  const createWrapper = (props = {}) => {
    return mount(Login, {
      props: { ...defaultProps, ...props }
    })
  }

  it('renders login form when show prop is true', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('h2').text()).toBe('Login')
    expect(wrapper.findAll('input').length).toBe(2)
  })

  it('does not render login form when show prop is false', () => {
    const wrapper = mount(Login, {
      props: { show: false }
    })
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.find('button[type="button"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('calls axios post method on successful login', async () => {
    const mockResponse = { data: { token: 'fake-token' } }
    axios.post.mockResolvedValue(mockResponse)

    const wrapper = createWrapper()

    await wrapper.find('input[type="email"]').setValue('john@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    
    await wrapper.find('form').trigger('submit.prevent')

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/api/login',
      {
        email: 'john@example.com',
        password: 'password123'
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'fake-token')
    expect(wrapper.emitted('login-success')).toBeTruthy()
  })

  it('handles login error', async () => {
    const mockErrorResponse = {
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    }
    axios.post.mockRejectedValue(mockErrorResponse)
    const spyConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = createWrapper()

    await wrapper.find('input[type="email"]').setValue('john@example.com')
    await wrapper.find('input[type="password"]').setValue('wrongpassword')
    
    await wrapper.find('form').trigger('submit.prevent')

    expect(spyConsoleError).toHaveBeenCalledWith('Error response:', mockErrorResponse.response.data)
    spyConsoleError.mockRestore()
  })
})