import '../src/index';

class Person
{
    public Name : string;
    public Age : number;
    public Gender : Gender;
    public DOCs : number[];

    constructor(name: string, age: number, gender : Gender)
    {
        this.Name = name;
        this.Age = age;
        this.Gender = gender;
        this.DOCs = [1, 2, 3];
    }
}

enum Gender 
{
    MALE, 
    FEMALE
}

describe("Testing linq", ()=>{

    let stringArray = ["adriano", "marino", "balera", "camila", "juliana", "andre"];
    let numberArray = [1, 5, 3, 7, 9, 3, 6];
    let dateArray = [new Date('2023-01-01'),new Date('2025-01-01'), new Date('2021-01-01')]
    let objectArray = 
    [
        new Person("adriano", 950, Gender.MALE),
        new Person("camila", 25, Gender.FEMALE),
        new Person("juliana", 30, Gender.FEMALE),
        new Person("andre", 30, Gender.MALE)

    ];
    

    test("Testing where clause", ()=>{

        let i = stringArray.Where(s => s.startsWith("a"));
        expect(i.length).toBe(2); 
        
        let c = objectArray.Where(s => s.Name.startsWith("a"));
        expect(c.length).toBe(2); 

        let u = numberArray.Where(s => s > 2);
        expect(u.length).toBe(6); 


        let d = dateArray.Where(s => s > new Date('2022-01-01'));
        expect(d.length).toBe(2);

    });

    test("Testing count clause", ()=>
    {
        expect(stringArray.Count()).toBe(6);
    });

    test("Testing any clause", ()=>
    {
        expect(stringArray.Any(s => s.startsWith("a"))).toBeTruthy();
        expect(stringArray.Any(s => s.startsWith("z"))).toBeFalsy();
        expect([].Any()).toBeFalsy();
    });

    test("Testing remove", ()=>
    {
        let copy = stringArray.Where(s => true);
        let init = copy.length;
        let first = copy.First();
        copy.Remove(first);
        expect(copy.length).toBe(init -1);
        expect(copy.Any(s => s == first)).toBeFalsy();
        expect([].Any()).toBeFalsy();
    });

    test("Testing removeAll", ()=>
    {
        let copy = stringArray.Where(s => true);
        let init = copy.length;
        let element = copy.Where(s => s.startsWith("a")).First();
        copy.RemoveAll(s => s.startsWith("a"));
        expect(copy.All(s => s != element)).toBeTruthy();
        expect(copy.length).toBe(init - stringArray.Where(s => s.startsWith("a")).Count());
    });


    test("Testing all clause", ()=>
    {
        expect(stringArray.All(s => typeof s == "string")).toBeTruthy();
        expect(stringArray.All(s => s.startsWith("a"))).toBeFalsy();
    });

    test("Testing first or default clause", ()=>
    {
        expect(stringArray.FirstOrDefault()).toBe("adriano");
        expect(stringArray.FirstOrDefault(s => s == "camila")).toBe("camila");
        expect(stringArray.FirstOrDefault(s => s == "adr")).toBeUndefined();        
        
    });

    test("Testing first clause", ()=>
    {
        expect(stringArray.First()).toBe("adriano");
        expect(stringArray.First(s => s == "camila")).toBe("camila");        
        
        let e : any; 
        try{
            stringArray.First(s => s == "adr");
        }catch(err)
        {e = err;}
        
        expect(e).not.toBeUndefined();
        expect(e.message).toBe("The sequence do not contains elements");
        
    });

    test("Testing order by clause", ()=>
    {
       let i = stringArray.OrderBy();

       expect(i[0]).toBe("adriano");
       expect(i[1]).toBe("andre");
       expect(i[2]).toBe("balera");

       expect(stringArray[0]).toBe("adriano");
       expect(stringArray[1]).toBe("marino");
       expect(stringArray[2]).toBe("balera");


       let u = objectArray.OrderBy(p => p.Name);

       expect(u[0].Name).toBe("adriano");
       expect(u[1].Name).toBe("andre");
       expect(u[2].Name).toBe("camila");
       expect(u[3].Name).toBe("juliana");

       u = objectArray.OrderByDescending(p => p.Name);

       expect(u[3].Name).toBe("adriano");
       expect(u[2].Name).toBe("andre");
       expect(u[1].Name).toBe("camila");
       expect(u[0].Name).toBe("juliana");


       let n = numberArray.OrderBy();

       expect(n[0]).toBe(1);
       expect(n[1]).toBe(3);
       expect(n[2]).toBe(3);
       expect(n[3]).toBe(5);

       let v = dateArray.OrderBy();

       expect(v[0]).toStrictEqual(new Date('2021-01-01'));
       expect(v[1]).toStrictEqual(new Date('2023-01-01'));
       expect(v[2]).toStrictEqual(new Date('2025-01-01'));
    });


    test("Testing group by clause", ()=>
    {        
        let g = objectArray.GroupBy(u => u.Gender);

        expect(g.Count()).toBe(2);

        for(let k of g)
        {
            let gender = k.Key;
            expect(k.Values.All(s => s.Gender == gender)).toBeTruthy();
        }
        
    });


    test("Testing aggregate clause", ()=>
    {        
        let g = numberArray.Aggregate();

        expect(g.Count()).toBe(6);

        let v = g.OrderByDescending(s => s.Count);

        expect(v[0].Count).toBe(2);
        expect(v[0].Values.Count()).toBe(2);
        expect(v[0].Values.All(s => s == 3)).toBeTruthy();
        expect(v[1].Count).toBe(1)
        
    });


    test("Testing select clause", ()=>
    {        
        let g = numberArray.Select(s => s ** 2);       

        expect(g[0]).toBe(1);
        expect(g[1]).toBe(25);
        expect(g[2]).toBe(9);       

        let u = objectArray.Select(s => s.Age);

        expect(u[0]).toBe(950);
        expect(u[1]).toBe(25);

        let p = numberArray.Select(s => new Person("Adriano", s, Gender.MALE));

        expect(typeof p[0]).toBe(typeof new Person("", 1, Gender.MALE));
        expect(p[0].Age).toBe(numberArray[0]);       
        
    });


    test("Testing select many clause", ()=>
    {        
        let g = objectArray.SelectMany(s => s.DOCs);       

        expect(g.Count()).toBe(12);       
        
    });

    test("Testing sum clause", ()=>
    {        
        expect([1,2,3,4,5].Sum()).toBe(15);   
        
        expect(objectArray.Sum(s => s.Age)).toBe(1035);   
        
        let e : any; 
        try{
            stringArray.Sum();
        }catch(err)
        {e = err;}
        
        expect(e).not.toBeUndefined();      
        
    });

    test("Testing max clause", ()=>
    {        
        expect([1,2,3,4,5].Max()).toBe(5);
        expect(objectArray.Max(s => s.Age)).toBe(950);     
        
        let e : any; 
        try{
            stringArray.Max();
        }catch(err)
        {e = err;}
        
        expect(e).not.toBeUndefined();      
        
    });

    test("Testing min clause", ()=>
    {        
        expect([1,2,3,4,5].Min()).toBe(1);  
        expect(objectArray.Min(s => s.Age)).toBe(25);            
        
        let e : any; 
        try{
            stringArray.Min();
        }catch(err)
        {e = err;}
        
        expect(e).not.toBeUndefined();      
        
    });

    test("Testing avg clause", ()=>
    {        
        expect([1,2,3,4,5].Avg()).toBe(3);  
        expect(objectArray.Avg(s => s.Age)).toBe(1035/4);            
        
        let e : any; 
        try{
            stringArray.Avg();
        }catch(err)
        {e = err;}
        
        expect(e).not.toBeUndefined();      
        
    });
    
});

