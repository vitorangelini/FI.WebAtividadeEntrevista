using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                if (!bo.VerificarExistencia(model.CPF.Replace(".","").Replace("-","")))
                {
                    var beneficiarioResult = new List<Beneficiario>();

                    if (model.Beneficiario!=null)
                    {
                        var beneficiario = JsonConvert.DeserializeObject<List<Beneficiario>>(model.Beneficiario);

                        foreach (var item in beneficiario)
                            beneficiarioResult.Add(new Beneficiario { Cpf = item.Cpf.Replace(".", "").Replace("-", ""), Nome = item.Nome });
                    }

                    model.Id = bo.Incluir(new Cliente()
                    {
                        CEP = model.CEP,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone,
                        CPF = model.CPF.Replace(".", "").Replace("-", ""),
                        Beneficiario = beneficiarioResult
                    });

                    return Json("Cadastro efetuado com sucesso");
                }
                else
                    return Json("Cpf já cadastrado na base de dados");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            var beneficiario = new List<Beneficiario>();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id              = model.Id,
                    CEP             = model.CEP,
                    Cidade          = model.Cidade,
                    Email           = model.Email,
                    Estado          = model.Estado,
                    Logradouro      = model.Logradouro,
                    Nacionalidade   = model.Nacionalidade,
                    Nome            = model.Nome,
                    Sobrenome       = model.Sobrenome,
                    Telefone        = model.Telefone,
                    CPF             = model.CPF.Replace(".", "").Replace("-", ""),
                    Beneficiario    = beneficiario
                });
                               
                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id            = cliente.Id,
                    CEP           = cliente.CEP,
                    Cidade        = cliente.Cidade,
                    Email         = cliente.Email,
                    Estado        = cliente.Estado,
                    Logradouro    = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome          = cliente.Nome,
                    Sobrenome     = cliente.Sobrenome,
                    Telefone      = cliente.Telefone,
                    CPF           = cliente.CPF.Replace(".", "").Replace("-", "")
                };
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}