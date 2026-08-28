namespace StudentDirectory.App.Models;

public sealed class Student
{
    public int Id { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Course { get; set; } = string.Empty;
    public string YearLevel { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public DateOnly EnrollmentDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);
}
