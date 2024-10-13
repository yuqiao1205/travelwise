import { getUser, updateUser, deleteUser } from '../../services/user'
import { db } from '../../db'

describe('getUser', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should resolve with user data if user exists', async () => {
    const mockUserId = 1
    const mockUserData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      city: 'Test City'
      // Add more user properties as needed
    }

    db.query = jest.fn().mockImplementation((sql, params, callback) => {
      callback(null, [mockUserData])
    })

    const result = await getUser(mockUserId)

    expect(result).toEqual(mockUserData)
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE `id` = ?', [mockUserId], expect.any(Function))
  })

  it('should resolve with null if user does not exist', async () => {
    const mockUserId = 1

    db.query = jest.fn().mockImplementation((sql, params, callback) => {
      callback(null, []) // Simulate empty result set
    })

    const result = await getUser(mockUserId)

    expect(result).toBeNull()
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE `id` = ?', [mockUserId], expect.any(Function))
  })

  it('should reject with an error if there is an error in the query', async () => {
    const mockUserId = 1
    const errorMessage = 'test error'
    db.query = jest.fn().mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage), null)
    })

    await expect(getUser(mockUserId)).rejects.toThrow(errorMessage)
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE `id` = ?', [mockUserId], expect.any(Function))
  })
})

describe('updateUser', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should resolve with true if user update is successful', async () => {
    const mockUserId = 1
    const mockCity = 'New City'
    const mockImg = 'new_image.jpg'
    const mockEmail = 'newemail@example.com'
    const mockNickname = 'newnickname'
    const mockFullname = 'New Full Name'
    const mockInterest = 'New Interest'

    db.query = jest.fn().mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 })
    })

    const result = await updateUser(mockUserId, mockCity, mockImg, mockEmail, mockNickname, mockFullname, mockInterest)

    expect(result).toBe(true)
    expect(db.query).toHaveBeenCalledWith('UPDATE users SET `city` = ?, `img` = ?, `email` = ?, `nickname` = ?, `fullname` = ?, `interest` = ? WHERE `id` = ?', [mockCity, mockImg, mockEmail, mockNickname, mockFullname, mockInterest, mockUserId], expect.any(Function))
  })

  it('should resolve with false if user update is unsuccessful', async () => {
    const mockUserId = 1
    const mockCity = 'New City'
    const mockImg = 'new_image.jpg'
    const mockEmail = 'newemail@example.com'
    const mockNickname = 'newnickname'
    const mockFullname = 'New Full Name'
    const mockInterest = 'New Interest'

    db.query = jest.fn().mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 0 })
    })

    const result = await updateUser(mockUserId, mockCity, mockImg, mockEmail, mockNickname, mockFullname, mockInterest)

    expect(result).toBe(false)
    expect(db.query).toHaveBeenCalledWith('UPDATE users SET `city` = ?, `img` = ?, `email` = ?, `nickname` = ?, `fullname` = ?, `interest` = ? WHERE `id` = ?', [mockCity, mockImg, mockEmail, mockNickname, mockFullname, mockInterest, mockUserId], expect.any(Function))
  })

  it('should reject with an error if there is an error in the query', async () => {
    const mockUserId = 1
    const mockCity = 'New City'
    const mockImg = 'new_image.jpg'
    const mockEmail = 'newemail@example.com'
    const mockNickname = 'newnickname'
    const mockFullname = 'New Full Name'
    const mockInterest = 'New Interest'
    const errorMessage = 'test error'

    db.query = jest.fn().mockImplementation((sql, params, callback) => {
      callback(new Error(errorMessage), null)
    })

    await expect(updateUser(mockUserId, mockCity, mockImg, mockEmail, mockNickname, mockFullname, mockInterest)).rejects.toThrow(errorMessage)
    expect(db.query).toHaveBeenCalledWith('UPDATE users SET `city` = ?, `img` = ?, `email` = ?, `nickname` = ?, `fullname` = ?, `interest` = ? WHERE `id` = ?', [mockCity, mockImg, mockEmail, mockNickname, mockFullname, mockInterest, mockUserId], expect.any(Function))
  })

  it('should update user with img if img is provided', async () => {
    const mockUserId = 1
    const mockCity = 'New City'
    const mockImg = 'new_image.jpg'
    const mockEmail = 'newemail@example.com'
    const mockNickname = 'newnickname'
    const mockFullname = 'New Full Name'
    const mockInterest = 'New Interest'

    db.query = jest.fn().mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 })
    })

    const result = await updateUser(mockUserId, mockCity, mockImg, mockEmail, mockNickname, mockFullname, mockInterest)

    expect(result).toBe(true)
    expect(db.query).toHaveBeenCalledWith('UPDATE users SET `city` = ?, `img` = ?, `email` = ?, `nickname` = ?, `fullname` = ?, `interest` = ? WHERE `id` = ?', [mockCity, mockImg, mockEmail, mockNickname, mockFullname, mockInterest, mockUserId], expect.any(Function))
  })

  it('should not update user img if img is not provided', async () => {
    const mockUserId = 1
    const mockCity = 'New City'
    const mockImg = null // or undefined
    const mockEmail = 'newemail@example.com'
    const mockNickname = 'newnickname'
    const mockFullname = 'New Full Name'
    const mockInterest = 'New Interest'

    db.query = jest.fn().mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 })
    })

    const result = await updateUser(mockUserId, mockCity, mockImg, mockEmail, mockNickname, mockFullname, mockInterest)

    expect(result).toBe(true)
    expect(db.query).toHaveBeenCalledWith('UPDATE users SET `city` = ?, `email` = ?, `nickname` = ?, `fullname` = ?, `interest` = ? WHERE `id` = ?', [mockCity, mockEmail, mockNickname, mockFullname, mockInterest, mockUserId], expect.any(Function))
  })
})
describe('deleteUser', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should resolve with true if user deletion is successful', async () => {
    const mockUserId = 1

    db.query = jest.fn().mockImplementation((q, params, callback) => {
      callback(null, { affectedRows: 1 })
    })

    const result = await deleteUser(mockUserId)

    expect(result).toBe(true)
    expect(db.query).toHaveBeenCalledWith('DELETE FROM users WHERE `id` = ?', [mockUserId], expect.any(Function))
  })

  it('should resolve with false if user deletion is unsuccessful', async () => {
    const mockUserId = 1

    db.query = jest.fn().mockImplementation((q, params, callback) => {
      callback(null, { affectedRows: 0 })
    })

    const result = await deleteUser(mockUserId)

    expect(result).toBe(false)
    expect(db.query).toHaveBeenCalledWith('DELETE FROM users WHERE `id` = ?', [mockUserId], expect.any(Function))
  })

  it('should reject with an error if there is an error in the query', async () => {
    const mockUserId = 1
    const errorMessage = 'test error'

    db.query = jest.fn().mockImplementation((q, params, callback) => {
      callback(new Error(errorMessage), null)
    })

    await expect(deleteUser(mockUserId)).rejects.toThrow(errorMessage)
    expect(db.query).toHaveBeenCalledWith('DELETE FROM users WHERE `id` = ?', [mockUserId], expect.any(Function))
  })
})
