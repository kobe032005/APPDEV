using Microsoft.EntityFrameworkCore;
using StudentRecords.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<StudentDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Students") ?? "Data Source=students.db"));
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var database = scope.ServiceProvider.GetRequiredService<StudentDbContext>();
    database.Database.EnsureCreated();
}

var students = app.MapGroup("/api/students").WithTags("Students");

students.MapGet("/", async (StudentDbContext database, CancellationToken cancellationToken) =>
    Results.Ok(await database.Students.AsNoTracking().OrderBy(student => student.Name).ToListAsync(cancellationToken)))
    .WithName("GetStudents");

students.MapGet("/{id:int}", async (int id, StudentDbContext database, CancellationToken cancellationToken) =>
{
    var student = await database.Students.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
    return student is null ? Results.NotFound() : Results.Ok(student);
}).WithName("GetStudent");

students.MapPost("/", async (Student student, StudentDbContext database, CancellationToken cancellationToken) =>
{
    if (await database.Students.AnyAsync(item => item.StudentId == student.StudentId, cancellationToken))
        return Results.Conflict("Student ID must be unique.");

    database.Students.Add(student);
    await database.SaveChangesAsync(cancellationToken);
    return Results.Created($"/api/students/{student.Id}", student);
}).WithName("CreateStudent");

students.MapPut("/{id:int}", async (int id, Student input, StudentDbContext database, CancellationToken cancellationToken) =>
{
    var student = await database.Students.FindAsync([id], cancellationToken);
    if (student is null) return Results.NotFound();

    input.Id = id;
    database.Entry(student).CurrentValues.SetValues(input);
    await database.SaveChangesAsync(cancellationToken);
    return Results.NoContent();
}).WithName("UpdateStudent");

students.MapDelete("/{id:int}", async (int id, StudentDbContext database, CancellationToken cancellationToken) =>
{
    var student = await database.Students.FindAsync([id], cancellationToken);
    if (student is null) return Results.NotFound();

    database.Students.Remove(student);
    await database.SaveChangesAsync(cancellationToken);
    return Results.NoContent();
}).WithName("DeleteStudent");

app.Run();
