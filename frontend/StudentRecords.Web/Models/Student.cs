namespace StudentRecords.Web.Models;

public sealed class Student
{
    public int Id { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Course { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string YearLevel { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public DateOnly EnrollmentDate { get; set; }
    public string Status { get; set; } = "Active";
    public string Address { get; set; } = string.Empty;
}
