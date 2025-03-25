import { mount } from '@vue/test-utils'
import Signup from '../auth/SignupModal.vue'
import axios from 'axios'
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('axios')

describe('Signup Component', () => {
  let wrapper

  beforeEach(() => {
    // Mock window.alert to avoid real alerts during testing
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    wrapper = mount(Signup, {
      props: {
        show: true
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
    vi.restoreAllMocks()
  })

  it('renders signup form when show prop is true', () => {
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('does not render signup form when show prop is false', () => {
    wrapper = mount(Signup, { props: { show: false } })
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('emits close event when close button is clicked', async () => {
    const closeButton = wrapper.find('button[type="button"]')
    expect(closeButton.exists()).toBe(true)
    expect(closeButton.text()).toBe('Close')
    await closeButton.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('shows alert when passwords do not match', async () => {
    const form = wrapper.find('form')
    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('John Doe') // name
    await inputs[1].setValue('john@example.com') // email
    await inputs[2].setValue('password123') // password
    await inputs[3].setValue('password456') // password_confirmation

    await form.trigger('submit.prevent') // Trigger form submit instead of button click

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match.')
  })

  it('calls axios post method on successful signup', async () => {
    const mockResponse = { data: { user: { id: 1, name: 'John Doe' } } }
    axios.post.mockResolvedValue(mockResponse)

    const form = wrapper.find('form')
    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('John Doe')
    await inputs[1].setValue('john@example.com')
    await inputs[2].setValue('password123')
    await inputs[3].setValue('password123')

    await form.trigger('submit.prevent')

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/api/register',
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    expect(window.alert).toHaveBeenCalledWith('Signup successful! You can now log in.')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('handles signup error and displays error message', async () => {
    const mockError = {
      response: {
        data: {
          errors: {
            email: ['The email has already been taken.'],
            password: ['The password is too weak.']
          }
        }
      }
    }
    axios.post.mockRejectedValue(mockError)

    const form = wrapper.find('form')
    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('John Doe')
    await inputs[1].setValue('john@example.com')
    await inputs[2].setValue('password123')
    await inputs[3].setValue('password123')

    await form.trigger('submit.prevent')

    expect(window.alert).toHaveBeenCalledWith(
      'Signup failed:\nThe email has already been taken.\nThe password is too weak.\n'
    )
  })
})