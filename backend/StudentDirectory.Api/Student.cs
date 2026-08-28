namespace StudentDirectory.Api;

public sealed class Student
{
    public int Id { get; set; }
    public required string StudentId { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Course { get; set; }
    public required string YearLevel { get; set; }
    public required string Section { get; set; }
    public required string Status { get; set; }
    public DateOnly EnrollmentDate { get; set; }
}
