/// <reference types="cypress"/>

describe('Teste da funcionalidade produtos', () => {
    let token

    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {token= tkn})
    })

    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) =>{
            expect(response.body.produtos[0].nome).to.equal('Logitech MX Vertical')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })
    });

    it('Cadastrar produto', () => {
        let produto = `Produto EBAC Adriano ${Math.floor(Math.random() * 1000)}`

        cy.request({
            method:'POST',
            url: 'produtos',
            body: {
                "nome": produto,
                "preco": 47,
                "descricao": "Produto Novo",
                "quantidade": 31
              },
              headers: {authorization: token}
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
        
    });

    it.only('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
       cy.cadastrarProduto(token, 'Produto EBAC Adriano 222', 47, 'Descricao produto', 31)
        .then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    });
});