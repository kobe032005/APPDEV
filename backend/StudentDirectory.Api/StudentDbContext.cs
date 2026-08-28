using Microsoft.EntityFrameworkCore;

namespace StudentDirectory.Api;

public sealed class StudentDbContext(DbContextOptions<StudentDbContext> options) : DbContext(options)
{
    public DbSet<Student> Students => Set<Student>();
}
