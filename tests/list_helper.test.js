const totalLikes = require('../utils/list_helper').totalLikes
const dummy = require('../utils/list_helper').dummy
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes
const { initialBlogs } = require('./test_helper')


describe('dummy is called', () => {
    test('dummy is called', () => {
        const blogs = []

        const result = dummy(blogs)
        expect(result).toBe(1)
    })
})

describe('total likes', () => {

    test('returns the total amount of likes for blogs in array', () => {
        const result = totalLikes(initialBlogs)
        expect(result).toBe(36)
    })
})

describe('Favorite blog', () => {

    test('returns the blog with most likes', () => {
        const result = favoriteBlog(initialBlogs)
        expect(result).toEqual(initialBlogs[2])
    })
})

describe('Most blogs', () => {

    test('return the author with most blogs and the amount of them', () => {
        const result = mostBlogs(initialBlogs)
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})

describe('Most likes on an author', () => {

    test('return the author who\'s blogs have gained most likes', () => {
        const result = mostLikes(initialBlogs)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})