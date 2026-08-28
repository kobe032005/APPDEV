using Microsoft.EntityFrameworkCore;

namespace StudentRecords.Api;

public sealed class StudentDbContext(DbContextOptions<StudentDbContext> options) : DbContext(options)
{
    public DbSet<Student> Students => Set<Student>();
}
