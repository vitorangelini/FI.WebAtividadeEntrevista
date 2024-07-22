
using System.ComponentModel.DataAnnotations;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Cliente
    /// </summary>
    public class BeneficiarioModel
    {
        /// <summary>
        /// Cpf do Beneficiario
        /// </summary>
        [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$", ErrorMessage = "O CPF deve estar no formato Ex 010.011.111-00.")]
        public string Cpf { get; set; }

        /// <summary>
        /// Nome do Beneficiario
        /// </summary>
        public string Nome { get; set; }
    }
}