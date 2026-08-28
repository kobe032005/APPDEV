using Microsoft.EntityFrameworkCore;
using StudentDirectory.Api;

var builder = WebApplication.CreateBuilder(args);
var databasePath = Path.Combine(builder.Environment.ContentRootPath, "students.db");
builder.Services.AddDbContext<StudentDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("StudentDatabase") ?? $"Data Source={databasePath}"));
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    await scope.ServiceProvider.GetRequiredService<StudentDbContext>().Database.EnsureCreatedAsync();
}

var students = app.MapGroup("/api/students").WithTags("Students");
students.MapGet("/", async (StudentDbContext db, CancellationToken token) =>
    await db.Students.AsNoTracking().OrderBy(student => student.Name).ToListAsync(token));
students.MapGet("/{id:int}", async (int id, StudentDbContext db, CancellationToken token) =>
{
    var student = await db.Students.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id, token);
    return student is null ? Results.NotFound() : Results.Ok(student);
});
students.MapPost("/", async (Student student, StudentDbContext db, CancellationToken token) =>
{
    if (await db.Students.AnyAsync(item => item.StudentId == student.StudentId, token))
        return Results.Conflict("Student ID must be unique.");
    db.Students.Add(student);
    await db.SaveChangesAsync(token);
    return Results.Created($"/api/students/{student.Id}", student);
});
students.MapPut("/{id:int}", async (int id, Student input, StudentDbContext db, CancellationToken token) =>
{
    var student = await db.Students.FindAsync(id, token);
    if (student is null) return Results.NotFound();
    input.Id = id;
    db.Entry(student).CurrentValues.SetValues(input);
    await db.SaveChangesAsync(token);
    return Results.NoContent();
});
students.MapDelete("/{id:int}", async (int id, StudentDbContext db, CancellationToken token) =>
{
    var student = await db.Students.FindAsync(id, token);
    if (student is null) return Results.NotFound();
    db.Students.Remove(student);
    await db.SaveChangesAsync(token);
    return Results.NoContent();
});

app.Run();
