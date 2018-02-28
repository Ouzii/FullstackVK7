const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb } = require('./test_helper')
const { initialUsers, usersInDb } = require('./users_test_helper.js')

describe('when there is initially some blogs saved', async () => {


    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = initialBlogs.map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)

    })

    test('all blogs are returned as json by GET /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(blogsInDatabase.length)

        const returnedTitles = response.body.map(b => b.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedTitles).toContain(blog.title)
        })
    })

    // test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
    //     const blogsInDatabase = await notesInDb()
    //     const blog = blogsInDatabase[0]

    //     const response = await api
    //         .get(`/api/blogs/${blog.id}`)
    //         .expect(200)
    //         .expect('Content-Type', /application\/json/)

    //     expect(response.body.content).toBe(blog.content)
    // })

    test('a spesific blogpost is withing the returned blogposts', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(b => b.title)
        expect(titles).toContain('First class tests')
    })

    test('a valid blog can be added', async () => {
        const beforeTest = await blogsInDb()
        const newBlog = {
            title: 'Blogipostin titteli on tärkeä',
            author: 'Myös kirjoittajalla on väliä!',
            url: 'www.www.www',
            likes: 4
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(b => b.title)

        expect(response.body.length).toBe(beforeTest.length + 1)
        expect(titles).toContain('Blogipostin titteli on tärkeä')
    })

    test('undefined likes becomes 0', async () => {
        const newBlog = {
            title: 'Testattavaa riittää',
            author: 'Kerkko',
            url: 'huntforglory.herokuapp.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const likes = response.body.map(l => l.likes)

        expect(likes[likes.length - 1]).toBe(0)
    })


    test('blogpost without author and/or url is not added', async () => {
        const beforeTest = await blogsInDb()

        const newBlogs = [
            {
                title: 'Test without url',
                author: 'Harjakainen',
                likes: '9'
            },
            {
                author: 'Harjakaisen koira',
                url: 'test.without.title',
                likes: '6'
            },
            {
                author: 'Test without url or title',
                likes: '9'
            }
        ]

        const blogObjects = newBlogs.map(b => new Blog(b))
        await Promise.all(blogObjects.map(
            b => api
                .post('/api/blogs')
                .send(b)
                .expect(400)))

        const afterTest = await blogsInDb()
        expect(beforeTest.length).toBe(afterTest.length)
    })
    describe('deletion of a blogpost', async () => {
        let newBlog

        beforeAll(async () => {
            newBlog = new Blog({
                title: "Poistoon",
                author: "Heti",
                url: "Testin jälkeen",
                likes: 3
            })
            await newBlog.save()
        })

        test('blogpost is removed correctly', async () => {
            const beforeTest = await blogsInDb()

            await api
                .delete(`/api/blogs/${newBlog._id}`)
                .expect(204)

            const afterDeletion = await blogsInDb()
            const afterDeletionTitles = afterDeletion.map(b => b.title)
            expect(afterDeletion.length).toBe(beforeTest.length - 1)
            expect(afterDeletionTitles).not.toContain(newBlog.title)
        })
    })

    describe('modifying a blogpost', async () => {
        let newBlog

        beforeAll(async () => {
            newBlog = new Blog({
                title: "Alussa",
                author: "Ei ole",
                url: "Tykkäyksiä",
                likes: 0
            })
            await newBlog.save()
        })

        test('blogpost is updated correctly', async () => {
            const beforeTest = await blogsInDb()

            updatedNewBlog = {
                title: newBlog.title,
                author: newBlog.author,
                url: newBlog.url,
                likes: newBlog.likes + 1
            }
            await api
                .put(`/api/blogs/${newBlog._id}`)
                .send(updatedNewBlog)
                .expect(200)

            const afterUpdate = await blogsInDb()

            expect(beforeTest.length).toBe(afterUpdate.length)
            expect(afterUpdate[afterUpdate.length - 1].likes).toBe(1)
        })
    })
})

describe('requires initial users in db', async () => {

    beforeAll(async () => {
        await User.remove({})

        const userObjects = initialUsers.map(user => new User(user))
        const promiseArray = userObjects.map(user => user.save())
        await Promise.all(promiseArray)
    })

    test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: "Ouzii",
            name: "Oskari Laaja",
            password: "salainen",
            adult: true
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be unique' })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users fails with proper statuscode and message is password is too short', async () => {
        const usersBeforeOperation = await usersInDb()
        
                const newUser = {
                    username: "Ouzii3",
                    name: "Oskari Laaja",
                    password: "sa",
                    adult: true
                }
        
                const result = await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(400)
                    .expect('Content-Type', /application\/json/)
        
                expect(result.body).toEqual({ error: 'password must be at least 3 characters long' })
        
                const usersAfterOperation = await usersInDb()
                expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })
})

afterAll(() => {
    server.close()
})